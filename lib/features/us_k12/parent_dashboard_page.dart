import 'package:flutter/material.dart';

import '../../core/k12/k12_service.dart';
import 'k12_widgets.dart';
import 'skill_tree_page.dart';

/// What a learner studied, where they struggled, and what to review next.
class ParentDashboardPage extends StatefulWidget {
  final K12Meta meta;
  final K12Learner learner;
  const ParentDashboardPage({super.key, required this.meta, required this.learner});

  @override
  State<ParentDashboardPage> createState() => _ParentDashboardPageState();
}

class _ParentDashboardPageState extends State<ParentDashboardPage> {
  K12Dashboard? _data;
  String? _error;
  String? _insight;
  bool _gettingInsight = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _error = null);
    try {
      final d = await K12Service.dashboard(widget.learner.id);
      if (mounted) setState(() => _data = d);
    } catch (e) {
      if (mounted) setState(() => _error = errorText(e));
    }
  }

  Future<void> _getInsight() async {
    setState(() => _gettingInsight = true);
    try {
      final t = await K12Service.insights(widget.learner.id);
      if (mounted) setState(() => _insight = t.isEmpty ? 'No activity yet — check back after a learning session.' : t);
    } catch (e) {
      if (mounted) setState(() => _insight = errorText(e));
    } finally {
      if (mounted) setState(() => _gettingInsight = false);
    }
  }

  void _openSubject(String subject) => Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => SkillTreePage(meta: widget.meta, learner: widget.learner, initialSubject: subject)),
      ).then((_) => _load());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.learner.nickname} · Parent view'),
        backgroundColor: k12Blue,
        foregroundColor: Colors.white,
      ),
      body: _error != null
          ? ErrorRetry(_error!, _load)
          : _data == null
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(onRefresh: _load, child: _body(_data!)),
    );
  }

  Widget _body(K12Dashboard d) {
    final meta = widget.meta;
    final empty = d.recent.isEmpty;
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
      children: [
        Text('${meta.gradeLabel(widget.learner.grade)} · ${meta.stateName(widget.learner.state)}',
            style: const TextStyle(color: Colors.black54)),
        const SizedBox(height: 12),
        Row(children: [
          _stat('${d.weekSessions}', 'lessons\nthis week'),
          _stat('${d.weekQuizzes}', 'quizzes\nthis week'),
          _stat(d.weekAveragePct == null ? '–' : '${(d.weekAveragePct! * 100).round()}%', 'average\nquiz score'),
        ]),
        const SizedBox(height: 16),
        if (empty)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: k12Soft, borderRadius: BorderRadius.circular(12)),
            child: const Text(
              'Nothing yet. Once your child starts a lesson or takes a quiz, you’ll see what they studied, '
              'where they struggled and what to review next.',
              style: TextStyle(height: 1.4),
            ),
          )
        else ...[
          _card(
            'Weekly summary',
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              if (_insight != null) MarkdownText(_insight!, fontSize: 14.5),
              if (_insight == null)
                const Text('A short note on how the week went and one thing to try at home.',
                    style: TextStyle(color: Colors.black54)),
              const SizedBox(height: 8),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(foregroundColor: k12Blue),
                onPressed: _gettingInsight ? null : _getInsight,
                icon: _gettingInsight
                    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                    : const Icon(Icons.auto_awesome_outlined),
                label: Text(_insight == null ? 'Write my weekly summary' : 'Refresh summary'),
              ),
            ]),
          ),
          if (d.struggling.isNotEmpty)
            _card('Needs review', Column(children: [for (final s in d.struggling) _skillRow(s, showStatus: false)]),
                color: k12Red),
          if (d.recommendations.isNotEmpty)
            _card(
              'Recommended next',
              Column(children: [
                for (final r in d.recommendations)
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Icon(subjectIcons[r.subject], color: k12Blue),
                    title: Text(r.name),
                    subtitle: Text('${meta.subjectLabel(r.subject)} · ${r.domain}\n${r.reason}'),
                    isThreeLine: true,
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => _openSubject(r.subject),
                  ),
              ]),
            ),
          _card(
            'By subject',
            Column(children: [
              for (final s in meta.subjects)
                if (d.subjects[s.id] != null) _subjectRow(s, d.subjects[s.id]!),
            ]),
          ),
          if (d.mastered.isNotEmpty)
            _card('Mastered', Column(children: [for (final s in d.mastered) _skillRow(s, showStatus: false)]),
                color: const Color(0xFF1B7F3B)),
          _card(
            'Recent activity',
            Column(children: [
              for (final a in d.recent)
                ListTile(
                  dense: true,
                  contentPadding: EdgeInsets.zero,
                  leading: Icon(
                    a.kind == 'quiz'
                        ? Icons.timer_outlined
                        : a.kind == 'stuck'
                            ? Icons.support_outlined
                            : Icons.school_outlined,
                    color: a.kind == 'stuck' ? k12Red : k12Blue,
                  ),
                  title: Text(a.name),
                  subtitle: Text([
                    meta.subjectLabel(a.subject),
                    a.kind == 'quiz' ? 'Quiz ${a.score}/${a.total}' : a.kind == 'stuck' ? 'Asked for help' : 'Lesson',
                    if (a.at != null) _when(a.at!),
                  ].join(' · ')),
                ),
            ]),
          ),
        ],
      ],
    );
  }

  String _when(DateTime t) {
    final days = DateTime.now().difference(t).inDays;
    if (days == 0) return 'today';
    if (days == 1) return 'yesterday';
    return '$days days ago';
  }

  Widget _stat(String value, String label) => Expanded(
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 4),
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(color: k12Soft, borderRadius: BorderRadius.circular(12)),
          child: Column(children: [
            Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: k12Blue)),
            const SizedBox(height: 2),
            Text(label, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, color: Colors.black54)),
          ]),
        ),
      );

  Widget _card(String title, Widget child, {Color color = k12Blue}) => Card(
        margin: const EdgeInsets.only(bottom: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: color)),
            const SizedBox(height: 8),
            child,
          ]),
        ),
      );

  Widget _skillRow(K12SkillRef s, {bool showStatus = true}) => ListTile(
        dense: true,
        contentPadding: EdgeInsets.zero,
        leading: Icon(subjectIcons[s.subject], color: k12Blue),
        title: Text(s.name),
        subtitle: Text('${widget.meta.subjectLabel(s.subject)} · ${s.domain}'
            '${s.lastPct != null ? ' · last quiz ${(s.lastPct! * 100).round()}%' : ''}'),
        trailing: showStatus ? StatusChip(s.status, dense: true) : const Icon(Icons.chevron_right),
        onTap: () => _openSubject(s.subject),
      );

  Widget _subjectRow(K12Option s, K12SubjectSummary sum) => Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Icon(subjectIcons[s.id], size: 18, color: k12Blue),
            const SizedBox(width: 6),
            Expanded(child: Text(s.label, style: const TextStyle(fontWeight: FontWeight.w600))),
            Text('${sum.mastered} mastered · ${sum.studied} studied'
                '${sum.struggling > 0 ? ' · ${sum.struggling} to review' : ''}',
                style: const TextStyle(fontSize: 12, color: Colors.black54)),
          ]),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: sum.studied == 0 ? 0 : sum.mastered / sum.studied,
              minHeight: 6,
              color: const Color(0xFF1B7F3B),
              backgroundColor: k12Soft,
            ),
          ),
        ]),
      );
}
