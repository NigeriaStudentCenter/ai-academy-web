import 'package:flutter/material.dart';

import '../../core/k12/k12_service.dart';
import 'k12_widgets.dart';
import 'exam_page.dart';
import 'quiz_page.dart';
import 'tutor_page.dart';
import 'worksheet_pdf.dart';

/// One skill: its official codes, its bite-sized micro-skills, and the ways
/// to learn it — tutor (with style and level), 5-minute quiz, worksheet.
class SkillPage extends StatefulWidget {
  final K12Meta meta;
  final K12Learner learner;
  final K12Tree tree;
  final K12Domain domain;
  final K12Skill skill;
  const SkillPage({
    super.key,
    required this.meta,
    required this.learner,
    required this.tree,
    required this.domain,
    required this.skill,
  });

  @override
  State<SkillPage> createState() => _SkillPageState();
}

class _SkillPageState extends State<SkillPage> {
  List<K12MicroSkill>? _micro;
  String? _microError;
  K12MicroSkill? _focus; // null = the whole skill
  String _style = 'socratic';
  String _tier = 'core';
  bool _makingSheet = false;

  bool get _cam => widget.tree.isCambridge;
  bool get _tiered => _cam && (widget.tree.syllabus?.tiered ?? false);

  /// Explanation styles for the curriculum (the virtual lab only for sciences).
  List<K12Option> get _styles => _cam
      ? widget.meta.camStyles
          .where((s) => s.detail != 'science' || (widget.tree.syllabus?.hasPractical ?? false))
          .toList()
      : widget.meta.styles;

  /// Levels: US tiers, Cambridge Core/Extended, or none (single-tier syllabi).
  List<K12Option> get _tiers => !_cam ? widget.meta.tiers : _tiered ? widget.meta.camTiers : const [];

  /// The level label shown when there's no choice (e.g. "AS Level").
  String get _fixedLevel => widget.domain.level == 'A2'
      ? 'A Level (second year)'
      : widget.domain.level == 'AS'
          ? 'AS Level'
          : widget.tree.syllabus?.qualification ?? '';

  String get _tierLabel => _tiers.isEmpty
      ? _fixedLevel
      : _tiers.firstWhere((t) => t.id == _tier, orElse: () => _tiers.first).label;

  @override
  void initState() {
    super.initState();
    if (_cam) {
      _style = 'examprep';
      _tier = 'extended';
    }
    _loadMicro();
  }

  Future<void> _loadMicro() async {
    setState(() => _microError = null);
    try {
      final list = await K12Service.microSkills(widget.learner.id, widget.tree.subject, widget.skill.id);
      if (mounted) setState(() => _micro = list);
    } catch (e) {
      if (mounted) setState(() => _microError = errorText(e));
    }
  }

  String get _microTitle => _focus?.title ?? '';

  void _learn([String? style]) => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => TutorPage(
            learner: widget.learner,
            tree: widget.tree,
            skill: widget.skill,
            micro: _microTitle,
            style: style ?? _style,
            styleLabel: _styles.firstWhere((s) => s.id == (style ?? _style), orElse: () => _styles.first).label,
            tier: _tier,
            tierLabel: _tierLabel,
          ),
        ),
      );

  void _exam() => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ExamPage(
            learner: widget.learner,
            tree: widget.tree,
            skill: widget.skill,
            micro: _microTitle,
            tier: _tier,
            tierLabel: _tierLabel,
          ),
        ),
      );

  void _quiz() => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => QuizPage(
            learner: widget.learner,
            subject: widget.tree.subject,
            skill: widget.skill,
            micro: _microTitle,
            tier: _tier,
          ),
        ),
      );

  Future<void> _worksheet() async {
    setState(() => _makingSheet = true);
    try {
      final quiz = await K12Service.quiz(widget.learner.id, widget.tree.subject, widget.skill.id,
          micro: _microTitle, tier: _tier, worksheet: true);
      await printWorksheet(quiz, focus: _microTitle);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(errorText(e))));
      }
    } finally {
      if (mounted) setState(() => _makingSheet = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = widget.skill;
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.domain.short.isNotEmpty ? widget.domain.short : widget.domain.name),
        backgroundColor: k12Blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        children: [
          Text(_cam
                  ? '${widget.tree.subjectLabel} › ${widget.domain.name}'
                  : '${widget.tree.gradeLabel} ${widget.tree.subjectLabel} › ${widget.domain.short.isNotEmpty ? widget.domain.short : widget.domain.name}',
              style: const TextStyle(color: Colors.black54, fontSize: 13)),
          const SizedBox(height: 4),
          Text(s.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, height: 1.25)),
          const SizedBox(height: 10),
          CodeChips(s.standards, color: s.fromState ? k12Red : k12Blue),
          const SizedBox(height: 20),
          _section('Pick what to learn',
              _cam ? 'This content broken into learning objectives, easiest first.' : 'The skill broken into bite-sized steps, easiest first.'),
          if (_microError != null)
            TextButton.icon(onPressed: _loadMicro, icon: const Icon(Icons.refresh), label: Text(_microError!))
          else if (_micro == null)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Row(children: [
                SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)),
                SizedBox(width: 10),
                Text('Breaking this skill down…'),
              ]),
            )
          else ...[
            _microTile(null, 1),
            for (var i = 0; i < _micro!.length; i++) _microTile(_micro![i], i + 2),
          ],
          const SizedBox(height: 20),
          _section('How should the tutor explain?', null),
          Wrap(spacing: 8, runSpacing: 8, children: [
            for (final st in _styles)
              ChoiceChip(
                label: Text(st.label),
                selected: _style == st.id,
                selectedColor: k12Blue,
                labelStyle: TextStyle(color: _style == st.id ? Colors.white : Colors.black87),
                showCheckmark: false,
                onSelected: (_) => setState(() => _style = st.id),
              ),
          ]),
          const SizedBox(height: 20),
          if (_tiers.isNotEmpty) ...[
            _section(_cam ? 'Exam tier' : 'Level',
                _cam ? 'Match the papers you’re entered for.' : 'Depth of Knowledge rises with each level.'),
            RadioGroup<String>(
              groupValue: _tier,
              onChanged: (v) => setState(() => _tier = v ?? _tier),
              child: Column(children: [
                for (final t in _tiers)
                  RadioListTile<String>(
                    value: t.id,
                    activeColor: k12Blue,
                    contentPadding: EdgeInsets.zero,
                    dense: true,
                    enabled: !(t.id == 'core' && widget.skill.extendedOnly),
                    title: Text(t.label, style: const TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: Text(t.id == 'core' && widget.skill.extendedOnly
                        ? 'This content is Extended only'
                        : t.detail),
                  ),
              ]),
            ),
          ] else if (_fixedLevel.isNotEmpty)
            _section('Level: $_fixedLevel', null),
          const SizedBox(height: 16),
          FilledButton.icon(
            style: FilledButton.styleFrom(backgroundColor: k12Blue, padding: const EdgeInsets.symmetric(vertical: 14)),
            onPressed: _learn,
            icon: const Icon(Icons.school_outlined),
            label: Text(_focus == null ? 'Start learning' : 'Learn: ${_focus!.title}'),
          ),
          if (_cam) ...[
            const SizedBox(height: 10),
            Row(children: [
              Expanded(
                child: FilledButton.tonalIcon(
                  style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
                  onPressed: _exam,
                  icon: const Icon(Icons.edit_note),
                  label: const Text('Exam question'),
                ),
              ),
              if (widget.tree.syllabus?.hasPractical ?? false) ...[
                const SizedBox(width: 10),
                Expanded(
                  child: FilledButton.tonalIcon(
                    style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
                    onPressed: () => _learn('practical'),
                    icon: const Icon(Icons.biotech_outlined),
                    label: const Text('Virtual lab'),
                  ),
                ),
              ],
            ]),
          ],
          const SizedBox(height: 10),
          Row(children: [
            Expanded(
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(foregroundColor: k12Blue, padding: const EdgeInsets.symmetric(vertical: 12)),
                onPressed: _quiz,
                icon: const Icon(Icons.timer_outlined),
                label: const Text('5-minute quiz'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(foregroundColor: k12Blue, padding: const EdgeInsets.symmetric(vertical: 12)),
                onPressed: _makingSheet ? null : _worksheet,
                icon: _makingSheet
                    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                    : const Icon(Icons.print_outlined),
                label: Text(_makingSheet ? 'Writing…' : 'Worksheet'),
              ),
            ),
          ]),
        ],
      ),
    );
  }

  Widget _section(String title, String? sub) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          if (sub != null) Text(sub, style: const TextStyle(fontSize: 12.5, color: Colors.black54)),
        ]),
      );

  Widget _microTile(K12MicroSkill? m, int n) {
    final selected = _focus == m;
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Material(
        color: selected ? k12Blue.withValues(alpha: 0.08) : Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
          side: BorderSide(color: selected ? k12Blue : Colors.black12),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(10),
          onTap: () => setState(() => _focus = m),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: Row(children: [
              CircleAvatar(
                radius: 12,
                backgroundColor: selected ? k12Blue : Colors.black12,
                foregroundColor: selected ? Colors.white : Colors.black87,
                child: m == null ? const Icon(Icons.all_inclusive, size: 14) : Text('${n - 1}', style: const TextStyle(fontSize: 12)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(m?.title ?? (_cam ? 'All of this content' : 'The whole skill'), style: const TextStyle(fontSize: 14.5)),
                  if (m != null)
                    Text(m.extended ? '${m.code} · Extended only' : m.code,
                        style: TextStyle(fontSize: 11, color: m.extended ? k12Red : Colors.black45, fontFamily: 'monospace')),
                ]),
              ),
              if (selected) const Icon(Icons.check_circle, color: k12Blue, size: 20),
            ]),
          ),
        ),
      ),
    );
  }
}
