import 'dart:async';

import 'package:flutter/material.dart';

import '../../core/k12/k12_service.dart';
import 'k12_widgets.dart';

/// A 5-minute practice quiz on one skill. The score is saved to the
/// learner's progress (and the parent dashboard).
class QuizPage extends StatefulWidget {
  final K12Learner learner;
  final String subject;
  final K12Skill skill;
  final String micro;
  final String tier;
  const QuizPage({
    super.key,
    required this.learner,
    required this.subject,
    required this.skill,
    required this.micro,
    required this.tier,
  });

  @override
  State<QuizPage> createState() => _QuizPageState();
}

class _QuizPageState extends State<QuizPage> {
  static const _limit = Duration(minutes: 5);
  K12Quiz? _quiz;
  String? _error;
  final Map<int, int> _answers = {};
  bool _marked = false;
  String? _status;
  Timer? _timer;
  Duration _left = _limit;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _error = null;
      _quiz = null;
      _answers.clear();
      _marked = false;
      _status = null;
      _left = _limit;
    });
    try {
      final quiz = await K12Service.quiz(widget.learner.id, widget.subject, widget.skill.id,
          micro: widget.micro, tier: widget.tier);
      if (!mounted) return;
      setState(() => _quiz = quiz);
      _timer?.cancel();
      _timer = Timer.periodic(const Duration(seconds: 1), (t) {
        if (!mounted || _marked) return t.cancel();
        setState(() => _left -= const Duration(seconds: 1));
        if (_left <= Duration.zero) t.cancel();
      });
    } catch (e) {
      if (mounted) setState(() => _error = errorText(e));
    }
  }

  int get _score {
    final qs = _quiz!.questions;
    return [for (var i = 0; i < qs.length; i++) if (_answers[i] == qs[i].answerIndex) 1].length;
  }

  Future<void> _mark() async {
    _timer?.cancel();
    setState(() => _marked = true);
    try {
      final status = await K12Service.quizResult(widget.learner.id, widget.subject, widget.skill.id,
          tier: widget.tier, score: _score, total: _quiz!.questions.length);
      if (mounted) setState(() => _status = status);
    } catch (_) {
      // The learner still sees their result; saving can fail offline.
    }
  }

  String _clock(Duration d) {
    final s = d.isNegative ? 0 : d.inSeconds;
    return '${s ~/ 60}:${(s % 60).toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('5-minute quiz'),
        backgroundColor: k12Blue,
        foregroundColor: Colors.white,
        actions: [
          if (_quiz != null && !_marked)
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Center(
                child: Row(children: [
                  const Icon(Icons.timer_outlined, size: 18),
                  const SizedBox(width: 4),
                  Text(_left <= Duration.zero ? "Time's up" : _clock(_left),
                      style: const TextStyle(fontWeight: FontWeight.w700)),
                ]),
              ),
            ),
        ],
      ),
      body: _error != null
          ? ErrorRetry(_error!, _load)
          : _quiz == null
              ? const Center(
                  child: Column(mainAxisSize: MainAxisSize.min, children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 12),
                    Text('Writing and checking your questions…'),
                  ]),
                )
              : _body(_quiz!),
    );
  }

  Widget _body(K12Quiz quiz) {
    final qs = quiz.questions;
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
      children: [
        Text(widget.micro.isNotEmpty ? widget.micro : widget.skill.name,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
        Text('${quiz.grade} · ${quiz.tier}', style: const TextStyle(color: Colors.black54)),
        const SizedBox(height: 12),
        if (_marked) _result(qs.length),
        for (var i = 0; i < qs.length; i++) _question(i, qs[i]),
        const SizedBox(height: 8),
        if (!_marked)
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: k12Blue, padding: const EdgeInsets.symmetric(vertical: 14)),
            onPressed: _answers.length == qs.length ? _mark : null,
            child: Text(_answers.length == qs.length
                ? 'Check my answers'
                : 'Answer all ${qs.length} questions'),
          )
        else
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(foregroundColor: k12Blue, padding: const EdgeInsets.symmetric(vertical: 12)),
            onPressed: _load,
            icon: const Icon(Icons.refresh),
            label: const Text('New quiz'),
          ),
      ],
    );
  }

  Widget _result(int total) {
    final pct = total == 0 ? 0 : _score / total;
    final (msg, color) = pct >= 0.8
        ? ('Brilliant work!', const Color(0xFF1B7F3B))
        : pct >= 0.6
            ? ('Good effort — nearly there.', const Color(0xFFB7791F))
            : ("Let's review this one together.", k12Red);
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(12)),
      child: Row(children: [
        Text('$_score/$total', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: color)),
        const SizedBox(width: 16),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(msg, style: TextStyle(fontWeight: FontWeight.w700, color: color)),
            const SizedBox(height: 4),
            if (_status != null) StatusChip(_status!),
          ]),
        ),
      ]),
    );
  }

  Widget _question(int i, K12Question q) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 8),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('${i + 1}. ${q.question}', style: const TextStyle(fontSize: 15.5, height: 1.4, fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          for (var o = 0; o < q.options.length; o++) _option(i, q, o),
          if (_marked) ...[
            const Divider(),
            if (q.explanation.isNotEmpty) Text(q.explanation, style: const TextStyle(height: 1.4)),
            const SizedBox(height: 6),
            Text('DOK ${q.dok} · ${q.dokLabel} · ${q.code}',
                style: const TextStyle(fontSize: 11.5, color: Colors.black45, fontFamily: 'monospace')),
          ],
        ]),
      ),
    );
  }

  Widget _option(int i, K12Question q, int o) {
    final chosen = _answers[i] == o;
    final right = o == q.answerIndex;
    Color? tint;
    IconData? icon;
    if (_marked && right) {
      tint = const Color(0xFF1B7F3B);
      icon = Icons.check_circle;
    } else if (_marked && chosen) {
      tint = k12Red;
      icon = Icons.cancel;
    }
    return InkWell(
      onTap: _marked ? null : () => setState(() => _answers[i] = o),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 3),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
        decoration: BoxDecoration(
          color: tint?.withValues(alpha: 0.08) ?? (chosen ? k12Blue.withValues(alpha: 0.08) : null),
          border: Border.all(color: tint ?? (chosen ? k12Blue : Colors.black12)),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(children: [
          Icon(icon ?? (chosen ? Icons.radio_button_checked : Icons.radio_button_unchecked),
              size: 20, color: tint ?? (chosen ? k12Blue : Colors.black38)),
          const SizedBox(width: 10),
          Expanded(child: Text(q.options[o], style: const TextStyle(fontSize: 15))),
        ]),
      ),
    );
  }
}
