import 'package:flutter/material.dart';

import '../../core/k12/k12_service.dart';
import 'k12_widgets.dart';
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

  @override
  void initState() {
    super.initState();
    // Younger learners usually want the simplest explanation.
    final g = widget.learner.grade;
    if (['K', '1', '2', '3'].contains(g)) _style = 'eli8';
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

  void _learn() => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => TutorPage(
            learner: widget.learner,
            tree: widget.tree,
            skill: widget.skill,
            micro: _microTitle,
            style: _style,
            styleLabel: widget.meta.styles.firstWhere((s) => s.id == _style).label,
            tier: _tier,
            tierLabel: widget.meta.tiers.firstWhere((t) => t.id == _tier).label,
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
          Text('${widget.tree.gradeLabel} ${widget.tree.subjectLabel} › ${widget.domain.short.isNotEmpty ? widget.domain.short : widget.domain.name}',
              style: const TextStyle(color: Colors.black54, fontSize: 13)),
          const SizedBox(height: 4),
          Text(s.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700, height: 1.25)),
          const SizedBox(height: 10),
          CodeChips(s.standards, color: s.fromState ? k12Red : k12Blue),
          const SizedBox(height: 20),
          _section('Pick what to learn', 'The skill broken into bite-sized steps, easiest first.'),
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
            for (final st in widget.meta.styles)
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
          _section('Level', 'Depth of Knowledge rises with each level.'),
          RadioGroup<String>(
            groupValue: _tier,
            onChanged: (v) => setState(() => _tier = v ?? _tier),
            child: Column(children: [
              for (final t in widget.meta.tiers)
                RadioListTile<String>(
                  value: t.id,
                  activeColor: k12Blue,
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                  title: Text(t.label, style: const TextStyle(fontWeight: FontWeight.w600)),
                  subtitle: Text(t.detail),
                ),
            ]),
          ),
          const SizedBox(height: 16),
          FilledButton.icon(
            style: FilledButton.styleFrom(backgroundColor: k12Blue, padding: const EdgeInsets.symmetric(vertical: 14)),
            onPressed: _learn,
            icon: const Icon(Icons.school_outlined),
            label: Text(_focus == null ? 'Start learning' : 'Learn: ${_focus!.title}'),
          ),
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
                  Text(m?.title ?? 'The whole skill', style: const TextStyle(fontSize: 14.5)),
                  if (m != null)
                    Text(m.code, style: const TextStyle(fontSize: 11, color: Colors.black45, fontFamily: 'monospace')),
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
