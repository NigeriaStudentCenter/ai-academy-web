import 'package:flutter/material.dart';

import '../../core/k12/k12_service.dart';
import 'k12_widgets.dart';

/// A Cambridge exam-style question: answer it, then see it marked against the
/// mark scheme — points earned and missed, keywords, and a full-mark answer.
class ExamPage extends StatefulWidget {
  final K12Learner learner;
  final K12Tree tree;
  final K12Skill skill;
  final String micro;
  final String tier;
  final String tierLabel;
  const ExamPage({
    super.key,
    required this.learner,
    required this.tree,
    required this.skill,
    required this.micro,
    required this.tier,
    required this.tierLabel,
  });

  @override
  State<ExamPage> createState() => _ExamPageState();
}

class _ExamPageState extends State<ExamPage> {
  K12Exam? _exam;
  String? _error;
  final _answer = TextEditingController();
  bool _marking = false;
  K12MarkResult? _result;
  bool _revealed = false; // mark scheme shown without answering

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _answer.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _exam = null;
      _error = null;
      _result = null;
      _revealed = false;
      _answer.clear();
    });
    try {
      final exam = await K12Service.exam(widget.learner.id, widget.tree.subject, widget.skill.id,
          micro: widget.micro, tier: widget.tier);
      if (mounted) setState(() => _exam = exam);
    } catch (e) {
      if (mounted) setState(() => _error = errorText(e));
    }
  }

  Future<void> _mark() async {
    FocusScope.of(context).unfocus();
    setState(() => _marking = true);
    try {
      final r = await K12Service.markAnswer(widget.learner.id, widget.tree.subject, widget.skill.id,
          tier: widget.tier, exam: _exam!, answer: _answer.text.trim());
      if (mounted) setState(() => _result = r);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(errorText(e))));
    } finally {
      if (mounted) setState(() => _marking = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Exam-style question'),
        backgroundColor: k12Blue,
        foregroundColor: Colors.white,
      ),
      body: _error != null
          ? ErrorRetry(_error!, _load)
          : _exam == null
              ? const Center(
                  child: Column(mainAxisSize: MainAxisSize.min, children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 12),
                    Text('Writing a question and having it checked…'),
                  ]),
                )
              : _body(_exam!),
    );
  }

  Widget _body(K12Exam e) {
    final done = _result != null || _revealed;
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
      children: [
        Text('${widget.tree.subjectLabel} · ${widget.skill.code} ${widget.skill.name}',
            style: const TextStyle(color: Colors.black54, fontSize: 13)),
        Text([widget.tierLabel, if (e.paper.isNotEmpty) e.paper].join(' · '),
            style: const TextStyle(color: Colors.black54, fontSize: 13)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: k12Soft, borderRadius: BorderRadius.circular(10)),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(color: k12Blue, borderRadius: BorderRadius.circular(6)),
              child: Text(e.commandWord,
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
            ),
            const SizedBox(width: 10),
            Expanded(child: Text(e.commandMeaning, style: const TextStyle(fontSize: 13, height: 1.35))),
          ]),
        ),
        const SizedBox(height: 14),
        Text('${e.question}  [${e.marks}]',
            style: const TextStyle(fontSize: 16.5, height: 1.45, fontWeight: FontWeight.w600)),
        const SizedBox(height: 14),
        TextField(
          controller: _answer,
          enabled: _result == null,
          minLines: 4,
          maxLines: 10,
          maxLength: 3000,
          onChanged: (_) => setState(() {}),
          decoration: const InputDecoration(
            hintText: 'Write your answer as you would in the exam…',
            border: OutlineInputBorder(),
          ),
        ),
        if (_result == null) ...[
          FilledButton.icon(
            style: FilledButton.styleFrom(backgroundColor: k12Blue, padding: const EdgeInsets.symmetric(vertical: 14)),
            onPressed: _marking || _answer.text.trim().length < 2 ? null : _mark,
            icon: _marking
                ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Icon(Icons.fact_check_outlined),
            label: Text(_marking ? 'Marking…' : 'Mark my answer'),
          ),
          if (!_revealed)
            TextButton(onPressed: () => setState(() => _revealed = true), child: const Text('Show the mark scheme')),
        ],
        if (_result != null) _resultCard(_result!),
        if (done) ..._markScheme(e),
        const SizedBox(height: 12),
        OutlinedButton.icon(
          style: OutlinedButton.styleFrom(foregroundColor: k12Blue, padding: const EdgeInsets.symmetric(vertical: 12)),
          onPressed: _load,
          icon: const Icon(Icons.refresh),
          label: const Text('New question'),
        ),
      ],
    );
  }

  Widget _resultCard(K12MarkResult r) {
    final pct = r.total == 0 ? 0 : r.score / r.total;
    final color = pct >= 0.8 ? const Color(0xFF1B7F3B) : pct >= 0.5 ? const Color(0xFFB7791F) : k12Red;
    return Container(
      margin: const EdgeInsets.only(top: 4, bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(12)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Text('${r.score}/${r.total}', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: color)),
          const SizedBox(width: 10),
          const Text('marks', style: TextStyle(color: Colors.black54)),
          const Spacer(),
          if (r.status.isNotEmpty) StatusChip(r.status),
        ]),
        const SizedBox(height: 8),
        for (final p in r.points)
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Icon(p.awarded ? Icons.check_circle : Icons.cancel_outlined,
                  size: 18, color: p.awarded ? const Color(0xFF1B7F3B) : k12Red),
              const SizedBox(width: 8),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(p.point, style: const TextStyle(height: 1.35)),
                  if (p.comment.isNotEmpty)
                    Text(p.comment, style: const TextStyle(fontSize: 12.5, color: Colors.black54, height: 1.3)),
                ]),
              ),
            ]),
          ),
        if (r.missingKeywords.isNotEmpty) ...[
          const SizedBox(height: 6),
          const Text('Mark-scheme keywords to include:', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          Wrap(spacing: 6, runSpacing: 6, children: [
            for (final k in r.missingKeywords)
              Chip(label: Text(k), visualDensity: VisualDensity.compact, backgroundColor: Colors.white),
          ]),
        ],
        if (r.feedback.isNotEmpty) ...[
          const SizedBox(height: 8),
          Text(r.feedback, style: const TextStyle(height: 1.4)),
        ],
        if (r.improvedAnswer.isNotEmpty) ...[
          const SizedBox(height: 10),
          const Text('A full-mark answer', style: TextStyle(fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          MarkdownText(r.improvedAnswer, fontSize: 14.5),
        ],
      ]),
    );
  }

  List<Widget> _markScheme(K12Exam e) => [
        const SizedBox(height: 12),
        Text(e.anyOf ? 'Mark scheme (any ${e.marks} points)' : 'Mark scheme (1 mark per point)',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: k12Blue)),
        const SizedBox(height: 6),
        for (final (i, m) in e.markScheme.indexed)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('${i + 1}. ${m.point}', style: const TextStyle(height: 1.35)),
              if (m.keywords.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 4, left: 14),
                  child: Wrap(spacing: 6, runSpacing: 4, children: [
                    for (final k in m.keywords)
                      Text(k, style: const TextStyle(fontWeight: FontWeight.w700, color: k12Blue, fontSize: 13)),
                  ]),
                ),
            ]),
          ),
        if (_result == null && e.modelAnswer.isNotEmpty) ...[
          const Text('Model answer', style: TextStyle(fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          MarkdownText(e.modelAnswer, fontSize: 14.5),
        ],
        if (e.examinerTip.isNotEmpty) ...[
          const SizedBox(height: 10),
          Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Icon(Icons.lightbulb_outline, size: 18, color: Color(0xFFB7791F)),
            const SizedBox(width: 6),
            Expanded(child: Text('Examiner tip: ${e.examinerTip}', style: const TextStyle(height: 1.35))),
          ]),
        ],
        Padding(
          padding: const EdgeInsets.only(top: 10),
          child: Text('An original practice question in the Cambridge style — not from a real past paper.',
              style: TextStyle(fontSize: 12, color: Colors.black.withValues(alpha: 0.45))),
        ),
      ];
}
