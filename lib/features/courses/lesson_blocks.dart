import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:go_router/go_router.dart';
import 'package:markdown/markdown.dart' as md;

import '../../core/courses/lesson_activity.dart';

const _green = Color(0xFF0B3D2E);
const _gold = Color(0xFFD1A054);

/// Where a lesson's interactive blocks save and read.
class LessonContext {
  final String courseId;
  final String lessonId;
  final Map<String, LessonSaved> saved; // by lesson
  const LessonContext(this.courseId, this.lessonId, this.saved);

  Map<String, String> exerciseValues(String exerciseId, {String? lessonId}) =>
      saved[lessonId ?? this.lessonId]?.exercises[exerciseId] ?? const {};
}

int _words(String s) =>
    s.trim().isEmpty ? 0 : s.trim().split(RegExp(r'\s+')).length;

// ---------------------------------------------------------------- exercise

/// An exercise the learner types into; saves to their account (autosave).
class ExerciseBlock extends StatefulWidget {
  final LessonContext ctx;
  final LessonExercise exercise;
  const ExerciseBlock({super.key, required this.ctx, required this.exercise});

  @override
  State<ExerciseBlock> createState() => _ExerciseBlockState();
}

class _ExerciseBlockState extends State<ExerciseBlock> {
  final Map<String, TextEditingController> _c = {};
  Timer? _debounce;
  String _status = '';
  bool _dirty = false;

  List<String> get _ids {
    final e = widget.exercise;
    if (e.isTable) {
      return [
        for (var r = 0; r < e.rows.length; r++)
          for (var c = 0; c < e.columns.length; c++) 'r${r}c$c',
      ];
    }
    return e.fields.map((f) => f.id).toList();
  }

  @override
  void initState() {
    super.initState();
    final saved = widget.ctx.exerciseValues(widget.exercise.id);
    for (final id in _ids) {
      _c[id] = TextEditingController(text: saved[id] ?? '')
        ..addListener(_changed);
    }
    if (saved.values.any((v) => v.trim().isNotEmpty)) _status = 'Saved';
  }

  void _changed() {
    if (!_dirty) setState(() => _dirty = true);
    _debounce?.cancel();
    _debounce = Timer(const Duration(seconds: 2), _save);
  }

  Future<void> _save() async {
    _debounce?.cancel();
    if (!_dirty) return;
    setState(() => _status = 'Saving…');
    try {
      await LessonActivityService.saveExercise(
          widget.ctx.courseId,
          widget.ctx.lessonId,
          widget.exercise.id,
          {for (final e in _c.entries) e.key: e.value.text});
      if (mounted) {
        setState(() {
          _dirty = false;
          _status = 'Saved';
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() => _status = 'Not saved — tap Save to try again');
      }
    }
  }

  @override
  void dispose() {
    if (_dirty) _save();
    _debounce?.cancel();
    for (final c in _c.values) {
      c.dispose();
    }
    super.dispose();
  }

  InputDecoration _dec(String label, {String? hint}) => InputDecoration(
        labelText: label,
        hintText: hint,
        alignLabelWithHint: true,
        border: const OutlineInputBorder(),
        isDense: true,
        filled: true,
        fillColor: Colors.white,
      );

  @override
  Widget build(BuildContext context) {
    final e = widget.exercise;
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10),
      color: const Color(0xFFF4F8F5),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: _green.withValues(alpha: 0.15)),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(children: [
              const Icon(Icons.edit_note, color: _green),
              const SizedBox(width: 6),
              Expanded(
                  child: Text(e.title,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: _green))),
            ]),
            if (e.intro.isNotEmpty)
              Padding(
                  padding: const EdgeInsets.only(top: 6), child: Text(e.intro)),
            const SizedBox(height: 10),
            if (e.isTable) ..._tableRows(e) else ..._fields(e),
            Row(
              children: [
                Expanded(
                  child: Text(_status,
                      style: TextStyle(
                          fontSize: 12.5,
                          color: _status.startsWith('Not')
                              ? Colors.red.shade700
                              : Colors.grey.shade700)),
                ),
                TextButton.icon(
                  onPressed: _dirty ? _save : null,
                  icon: const Icon(Icons.save_outlined, size: 18),
                  label: const Text('Save'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _fields(LessonExercise e) => [
        for (final f in e.fields) ...[
          // The question sits above its box so long questions stay readable.
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Text(f.label,
                style:
                    const TextStyle(fontWeight: FontWeight.w600, height: 1.35)),
          ),
          TextField(
            controller: _c[f.id],
            minLines: f.multiline ? (f.minWords > 0 ? 6 : 2) : 1,
            maxLines: f.multiline ? 12 : 1,
            decoration: const InputDecoration(
              hintText: 'Your answer',
              border: OutlineInputBorder(),
              isDense: true,
              filled: true,
              fillColor: Colors.white,
            ),
          ),
          if (f.minWords > 0 || f.maxWords > 0)
            ValueListenableBuilder(
              valueListenable: _c[f.id]!,
              builder: (context, v, _) {
                final n = _words(v.text);
                final ok = (f.minWords == 0 || n >= f.minWords) &&
                    (f.maxWords == 0 || n <= f.maxWords);
                return Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text('$n words (aim for ${f.minWords}–${f.maxWords})',
                      style: TextStyle(
                          fontSize: 12.5,
                          color: ok
                              ? Colors.green.shade700
                              : Colors.grey.shade700)),
                );
              },
            ),
          const SizedBox(height: 14),
        ],
      ];

  /// Table exercises: one card per row, one field per column (works on phones).
  List<Widget> _tableRows(LessonExercise e) => [
        for (var r = 0; r < e.rows.length; r++)
          Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                    RegExp(r'^\d+$').hasMatch(e.rows[r])
                        ? 'Row ${e.rows[r]}'
                        : e.rows[r],
                    style: const TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 6),
                for (var c = 0; c < e.columns.length; c++) ...[
                  TextField(
                      controller: _c['r${r}c$c'],
                      minLines: 1,
                      maxLines: 4,
                      decoration: _dec(e.columns[c])),
                  const SizedBox(height: 6),
                ],
              ],
            ),
          ),
      ];
}

// ---------------------------------------------------------------- quiz

/// Knowledge check: answers are shown only after the learner submits.
class QuizBlock extends StatefulWidget {
  final LessonContext ctx;
  final List<QuizQuestion> questions;
  const QuizBlock({super.key, required this.ctx, required this.questions});

  @override
  State<QuizBlock> createState() => _QuizBlockState();
}

class _QuizBlockState extends State<QuizBlock> {
  late List<int?> _chosen;
  QuizResult? _result;
  bool _submitting = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _result = widget.ctx.saved[widget.ctx.lessonId]?.quiz;
    _chosen = _result != null
        ? _result!.results.map((r) => r.chosen).toList()
        : List<int?>.filled(widget.questions.length, null);
  }

  Future<void> _submit() async {
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final r = await LessonActivityService.submitQuiz(widget.ctx.courseId,
          widget.ctx.lessonId, _chosen.map((c) => c!).toList());
      if (mounted) setState(() => _result = r);
    } catch (e) {
      if (mounted) {
        setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final r = _result;
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10),
      color: const Color(0xFFFFF8E6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(children: [
              const Icon(Icons.quiz_outlined, color: _green),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                    r == null
                        ? 'Knowledge check'
                        : 'Knowledge check — ${r.score} / ${r.total}',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: _green)),
              ),
            ]),
            if (r == null)
              const Padding(
                padding: EdgeInsets.only(top: 4),
                child: Text(
                    'Answer every question, then submit to see the answers.'),
              ),
            for (var i = 0; i < widget.questions.length; i++) _question(i, r),
            if (_error != null)
              Text(_error!, style: TextStyle(color: Colors.red.shade700)),
            if (r == null)
              ElevatedButton(
                onPressed:
                    _submitting || _chosen.contains(null) ? null : _submit,
                style: ElevatedButton.styleFrom(
                    backgroundColor: _green, foregroundColor: Colors.white),
                child: Text(_submitting ? 'Marking…' : 'Submit answers'),
              )
            else
              TextButton.icon(
                onPressed: () => setState(() {
                  _result = null;
                  _chosen = List<int?>.filled(widget.questions.length, null);
                }),
                icon: const Icon(Icons.refresh),
                label: const Text('Try again'),
              ),
          ],
        ),
      ),
    );
  }

  Widget _question(int i, QuizResult? r) {
    final q = widget.questions[i];
    final res = r != null && i < r.results.length ? r.results[i] : null;
    return Padding(
      padding: const EdgeInsets.only(top: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('${i + 1}. ${q.question}',
              style: const TextStyle(fontWeight: FontWeight.w600)),
          for (var o = 0; o < q.options.length; o++)
            _option(i, o, q.options[o], res),
          if (res != null)
            Container(
              margin: const EdgeInsets.only(top: 4),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color:
                    res.correct ? Colors.green.shade50 : Colors.orange.shade50,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                '${res.correct ? 'Correct.' : 'The answer is ${String.fromCharCode(65 + res.answer)}.'} ${res.explanation}',
                style: const TextStyle(fontSize: 14, height: 1.4),
              ),
            ),
        ],
      ),
    );
  }

  Widget _option(int i, int o, String text, dynamic res) {
    final letter = String.fromCharCode(65 + o);
    Color? tint;
    IconData? mark;
    if (res != null) {
      if (o == res.answer) {
        tint = Colors.green.shade100;
        mark = Icons.check_circle;
      } else if (o == res.chosen) {
        tint = Colors.red.shade50;
        mark = Icons.cancel;
      }
    }
    return InkWell(
      onTap: res == null ? () => setState(() => _chosen[i] = o) : null,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        margin: const EdgeInsets.only(top: 4),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        decoration:
            BoxDecoration(color: tint, borderRadius: BorderRadius.circular(8)),
        child: Row(children: [
          Icon(
            mark ??
                (_chosen[i] == o
                    ? Icons.radio_button_checked
                    : Icons.radio_button_unchecked),
            size: 20,
            color: mark == Icons.check_circle
                ? Colors.green.shade700
                : mark == Icons.cancel
                    ? Colors.red.shade400
                    : _green,
          ),
          const SizedBox(width: 8),
          Expanded(child: Text('$letter. $text')),
        ]),
      ),
    );
  }
}

// ---------------------------------------------------------------- coach

/// Opens the AI thinking partner for this exercise.
class CoachBlock extends StatelessWidget {
  final LessonContext ctx;
  final LessonCoach coach;
  const CoachBlock({super.key, required this.ctx, required this.coach});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10),
      color: _green,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              const Icon(Icons.psychology_alt, color: _gold),
              const SizedBox(width: 8),
              Expanded(
                child: Text(coach.title,
                    style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16)),
              ),
            ]),
            if (coach.intro.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Text(coach.intro,
                    style: const TextStyle(color: Colors.white, height: 1.4)),
              ),
            const SizedBox(height: 10),
            ElevatedButton.icon(
              onPressed: () => Navigator.of(context).push(MaterialPageRoute(
                builder: (_) => CoachChatPage(ctx: ctx, coach: coach),
              )),
              icon: const Icon(Icons.chat_bubble_outline),
              label: const Text('Start the exercise'),
              style: ElevatedButton.styleFrom(
                  backgroundColor: _gold, foregroundColor: Colors.white),
            ),
          ],
        ),
      ),
    );
  }
}

/// Chat with an exercise's AI thinking partner. The first message is the
/// exercise prompt, filled in with the learner's saved answers (editable).
class CoachChatPage extends StatefulWidget {
  final LessonContext ctx;
  final LessonCoach coach;
  const CoachChatPage({super.key, required this.ctx, required this.coach});

  @override
  State<CoachChatPage> createState() => _CoachChatPageState();
}

class _CoachChatPageState extends State<CoachChatPage> {
  final List<({String role, String content})> _turns = [];
  final _input = TextEditingController();
  final _scroll = ScrollController();
  bool _waiting = false;
  bool _preparing = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _prepare();
  }

  Future<void> _prepare() async {
    var answers = '';
    if (widget.coach.usesAnswers) {
      answers = await LessonActivityService.coachAnswers(
          widget.ctx.courseId, widget.ctx.lessonId, widget.coach.id);
    }
    final template = widget.coach.promptTemplate;
    _input.text = template.contains('[PASTE YOUR ANSWERS]')
        ? template.replaceFirst('[PASTE YOUR ANSWERS]',
            answers.isNotEmpty ? answers : '[Write or paste your answers here]')
        : template;
    if (mounted) setState(() => _preparing = false);
  }

  Future<void> _send() async {
    final text = _input.text.trim();
    if (text.isEmpty || _waiting) return;
    setState(() {
      _turns.add((role: 'user', content: text));
      _input.clear();
      _waiting = true;
      _error = null;
    });
    _toEnd();
    try {
      final reply = await LessonActivityService.coachReply(
          widget.ctx.courseId, widget.ctx.lessonId, widget.coach.id, _turns);
      if (mounted) {
        setState(() => _turns.add((role: 'assistant', content: reply)));
      }
    } catch (e) {
      if (mounted) {
        setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
      }
    } finally {
      if (mounted) setState(() => _waiting = false);
      _toEnd();
    }
  }

  void _toEnd() => WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_scroll.hasClients) {
          _scroll.animateTo(_scroll.position.maxScrollExtent,
              duration: const Duration(milliseconds: 250),
              curve: Curves.easeOut);
        }
      });

  @override
  void dispose() {
    _input.dispose();
    _scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.coach.title),
        backgroundColor: _green,
        foregroundColor: Colors.white,
      ),
      body: _preparing
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Expanded(
                  child: ListView(
                    controller: _scroll,
                    padding: const EdgeInsets.all(16),
                    children: [
                      if (_turns.isEmpty)
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF4F8F5),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            widget.coach.usesAnswers
                                ? 'Your exercise prompt is ready below, with your saved answers filled in. Check it, edit anything you like, then send. Your thinking partner asks questions — the decisions stay yours.'
                                : 'Your exercise prompt is ready below. Edit it if you like, then send.',
                            style: const TextStyle(height: 1.4),
                          ),
                        ),
                      for (final t in _turns) _bubble(t),
                      if (_waiting)
                        const Padding(
                          padding: EdgeInsets.all(12),
                          child: Row(children: [
                            SizedBox(
                                width: 18,
                                height: 18,
                                child:
                                    CircularProgressIndicator(strokeWidth: 2)),
                            SizedBox(width: 10),
                            Text('Thinking…'),
                          ]),
                        ),
                      if (_error != null)
                        Card(
                          color: Colors.red.shade50,
                          child: ListTile(
                            leading: const Icon(Icons.error_outline,
                                color: Colors.red),
                            title: Text(_error!),
                          ),
                        ),
                    ],
                  ),
                ),
                SafeArea(
                  top: false,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(12, 6, 12, 12),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _input,
                            minLines: 1,
                            maxLines: _turns.isEmpty ? 10 : 5,
                            onChanged: (_) => setState(() {}),
                            decoration: const InputDecoration(
                              hintText: 'Type your reply…',
                              border: OutlineInputBorder(),
                              isDense: true,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton.filled(
                          onPressed: _waiting || _input.text.trim().isEmpty
                              ? null
                              : _send,
                          style: IconButton.styleFrom(backgroundColor: _green),
                          icon: const Icon(Icons.send),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _bubble(({String role, String content}) t) {
    final mine = t.role == 'user';
    return Align(
      alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
      child: ConstrainedBox(
        constraints:
            BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.85),
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 6),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            color: mine ? _green : const Color(0xFFF1F4F2),
            borderRadius: BorderRadius.circular(14),
          ),
          child: mine
              ? Text(t.content,
                  style: const TextStyle(color: Colors.white, height: 1.4))
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    HtmlWidget(md.markdownToHtml(t.content),
                        textStyle: const TextStyle(fontSize: 15, height: 1.45)),
                    IconButton(
                      tooltip: 'Copy',
                      visualDensity: VisualDensity.compact,
                      icon: const Icon(Icons.copy, size: 16),
                      onPressed: () =>
                          Clipboard.setData(ClipboardData(text: t.content)),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------- portfolio

/// A module's submission items, with what the learner has saved so far.
class PortfolioBlock extends StatelessWidget {
  final LessonContext ctx;
  final List<PortfolioItem> items;
  final List<LessonExercise> Function(String lessonId) exercisesOf;

  const PortfolioBlock(
      {super.key,
      required this.ctx,
      required this.items,
      required this.exercisesOf});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final item in items) _item(context, item),
      ],
    );
  }

  Widget _item(BuildContext context, PortfolioItem item) {
    final values = ctx.exerciseValues(item.exerciseId, lessonId: item.lessonId);
    final filled = values.values.where((v) => v.trim().isNotEmpty).length;
    final ex = exercisesOf(item.lessonId)
        .where((e) => e.id == item.exerciseId)
        .firstOrNull;
    final preview = ex == null
        ? ''
        : ex.isTable
            ? '$filled cells completed'
            : ex.fields
                .map((f) => values[f.id]?.trim() ?? '')
                .where((v) => v.isNotEmpty)
                .join(' · ');
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: ListTile(
        leading: Icon(
            filled > 0 ? Icons.check_circle : Icons.radio_button_unchecked,
            color: filled > 0 ? Colors.green.shade700 : Colors.grey),
        title: Text(item.title,
            style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(
          filled > 0 ? preview : 'Not started yet — tap to open',
          maxLines: 3,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: item.lessonId == ctx.lessonId
            ? null
            : () =>
                context.go('/course/${ctx.courseId}/lesson/${item.lessonId}'),
      ),
    );
  }
}
