import 'package:flutter/material.dart';

import '../../core/k12/k12_service.dart';
import 'k12_widgets.dart';
import 'command_words_page.dart';
import 'skill_page.dart';

/// A learner's skill tree for one subject: subject → domain → skill, with
/// progress on every skill. Tapping a skill breaks it into micro-skills.
class SkillTreePage extends StatefulWidget {
  final K12Meta meta;
  final K12Learner learner;
  final String? initialSubject;
  const SkillTreePage({super.key, required this.meta, required this.learner, this.initialSubject});

  @override
  State<SkillTreePage> createState() => _SkillTreePageState();
}

class _SkillTreePageState extends State<SkillTreePage> {
  /// (id, label, icon) for each subject the learner can pick.
  late final List<(String, String, IconData)> _subjects = widget.learner.isCambridge
      ? [
          for (final s in widget.meta.camSubjects[widget.learner.stage] ?? const <K12CamSubject>[])
            (s.code, s.label, s.practical ? Icons.science_outlined : Icons.menu_book_outlined)
        ]
      : [for (final s in widget.meta.subjects) (s.id, s.label, subjectIcons[s.id] ?? Icons.school_outlined)];
  late String _subject = widget.initialSubject ?? (_subjects.isEmpty ? 'math' : _subjects.first.$1);
  K12Tree? _tree;
  Map<String, K12Progress> _progress = {};
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _error = null;
      _tree = null;
    });
    try {
      final (tree, progress) = await K12Service.tree(widget.learner.id, _subject);
      if (mounted) {
        setState(() {
          _tree = tree;
          _progress = progress;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _error = errorText(e));
    }
  }

  Future<void> _open(K12Domain domain, K12Skill skill) async {
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => SkillPage(
          meta: widget.meta,
          learner: widget.learner,
          tree: _tree!,
          domain: domain,
          skill: skill,
        ),
      ),
    );
    _load(); // progress may have changed
  }

  @override
  Widget build(BuildContext context) {
    final l = widget.learner;
    return Scaffold(
      appBar: AppBar(
        title: Text(l.isCambridge
            ? '${l.nickname} · ${const {'lower': 'Stage 9', 'igcse': 'IGCSE', 'alevel': 'AS & A Level'}[l.stage] ?? 'Cambridge'}'
            : '${l.nickname} · ${widget.meta.gradeLabel(l.grade)}'),
        backgroundColor: k12Blue,
        foregroundColor: Colors.white,
        actions: [
          if (_tree?.syllabus != null)
            IconButton(
              tooltip: 'Command words',
              icon: const Icon(Icons.translate),
              onPressed: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => CommandWordsPage(syllabus: _tree!.syllabus!))),
            ),
        ],
      ),
      body: Column(children: [
        SizedBox(
          height: 56,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            children: [
              for (final (id, label, icon) in _subjects)
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    avatar: Icon(icon, size: 18, color: _subject == id ? Colors.white : k12Blue),
                    label: Text(label),
                    selected: _subject == id,
                    selectedColor: k12Blue,
                    labelStyle: TextStyle(color: _subject == id ? Colors.white : k12Blue),
                    showCheckmark: false,
                    onSelected: (_) {
                      if (_subject != id) {
                        _subject = id;
                        _load();
                      }
                    },
                  ),
                ),
            ],
          ),
        ),
        Expanded(
          child: _error != null
              ? ErrorRetry(_error!, _load)
              : _tree == null
                  ? const Center(child: CircularProgressIndicator())
                  : _treeView(_tree!),
        ),
      ]),
    );
  }

  Widget _treeView(K12Tree tree) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 32),
      children: [
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: k12Soft, borderRadius: BorderRadius.circular(12)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Icon(tree.family == 'state' ? Icons.flag_outlined : Icons.verified_outlined,
                  size: 18, color: k12Blue),
              const SizedBox(width: 6),
              Expanded(
                child: Text(tree.stateFramework,
                    style: const TextStyle(fontWeight: FontWeight.w700, color: k12Blue)),
              ),
            ]),
            const SizedBox(height: 6),
            Text(tree.alignmentNote, style: const TextStyle(fontSize: 13, height: 1.4)),
            if (tree.syllabus != null && tree.syllabus!.papers.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text('Papers: ${tree.syllabus!.papers.join(' · ')}',
                  style: const TextStyle(fontSize: 12, color: Colors.black54, height: 1.4)),
            ],
          ]),
        ),
        const SizedBox(height: 12),
        for (final d in tree.domains) _domainCard(d),
      ],
    );
  }

  Widget _domainCard(K12Domain d) {
    final statuses = d.skills.map((s) => _progress[s.id]?.status).toList();
    final mastered = statuses.where((s) => s == 'mastered').length;
    final flagged = statuses.contains('struggling');
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      clipBehavior: Clip.antiAlias,
      child: ExpansionTile(
        initiallyExpanded: widget.learner.grade == 'K' || d.skills.length <= 3,
        leading: CircleAvatar(
          radius: 18,
          backgroundColor: d.fromState ? k12Red : k12Blue,
          foregroundColor: Colors.white,
          child: Text('$mastered', style: const TextStyle(fontWeight: FontWeight.w700)),
        ),
        title: Text(d.short.isNotEmpty ? d.short : d.name,
            style: const TextStyle(fontWeight: FontWeight.w700)),
        subtitle: Text(
          '${d.code} · $mastered of ${d.skills.length} mastered${flagged ? ' · needs review' : ''}'
          '${d.fromState ? ' · state addition' : ''}'
          '${d.level == 'AS' ? ' · AS Level' : d.level == 'A2' ? ' · A Level' : ''}',
          style: TextStyle(fontSize: 12, color: flagged ? k12Red : Colors.black54),
        ),
        childrenPadding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
        children: [
          if (d.note.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(bottom: 8, left: 8),
              child: Text(d.note, style: const TextStyle(fontSize: 12, color: Colors.black54)),
            ),
          for (final s in d.skills) _skillTile(d, s),
        ],
      ),
    );
  }

  Widget _skillTile(K12Domain d, K12Skill s) {
    final p = _progress[s.id];
    return InkWell(
      onTap: () => _open(d, s),
      borderRadius: BorderRadius.circular(10),
      child: Container(
        margin: const EdgeInsets.only(left: 8, bottom: 6),
        padding: const EdgeInsets.fromLTRB(12, 10, 8, 10),
        decoration: BoxDecoration(
          border: Border(left: BorderSide(color: k12Blue.withValues(alpha: 0.35), width: 3)),
          color: Colors.white,
        ),
        child: Row(children: [
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(s.name, style: const TextStyle(fontSize: 14.5, height: 1.3)),
              const SizedBox(height: 4),
              Row(children: [
                Text(s.code, style: const TextStyle(fontSize: 11.5, color: Colors.black54, fontFamily: 'monospace')),
                const SizedBox(width: 8),
                if (s.extendedOnly) ...[
                  const Text('Extended', style: TextStyle(fontSize: 11, color: k12Red, fontWeight: FontWeight.w600)),
                  const SizedBox(width: 6),
                ],
                StatusChip(p?.status ?? '', dense: true),
                if (p?.lastPct != null) ...[
                  const SizedBox(width: 6),
                  Text('${(p!.lastPct! * 100).round()}%',
                      style: const TextStyle(fontSize: 11.5, color: Colors.black54)),
                ],
              ]),
            ]),
          ),
          const Icon(Icons.chevron_right, color: Colors.black38),
        ]),
      ),
    );
  }
}
