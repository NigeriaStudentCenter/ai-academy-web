import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:markdown/markdown.dart' as md;
import 'package:url_launcher/url_launcher.dart';

import '../../core/auth/app_auth_state.dart';
import '../../core/theme/app_colors.dart';
import '../../core/tutor/command_center_service.dart';
import '../../widgets/app_nav_drawer.dart';

// Curriculum accents, as on the web tutor: Nigerian green, British navy.
const _ngColor = Color(0xFF0B7A3E);
const _ukColor = Color(0xFF1D3F8F);
const _otherSubject = '__other__';

/// AI Tutor Command Center — a Socratic tutor on the Nigerian (NERDC) and
/// British (UK National) curricula, for AI Academy for Teens learners.
class CommandCenterPage extends StatefulWidget {
  const CommandCenterPage({super.key});

  @override
  State<CommandCenterPage> createState() => _CommandCenterPageState();
}

class _CommandCenterPageState extends State<CommandCenterPage> {
  List<Curriculum>? _curricula;
  String? _loadError;

  // The path being set up.
  Curriculum? _curriculum;
  String? _level;
  String? _year;
  String? _subject;
  final _otherSubjectCtrl = TextEditingController();
  final _topicCtrl = TextEditingController();
  List<String> _suggestions = [];
  bool _suggesting = false;

  // The running session (null while setting up).
  LearningPath? _path;
  final List<TutorTurn> _turns = [];
  bool _waiting = false;
  String? _sessionError;
  final _inputCtrl = TextEditingController();
  final _scroll = ScrollController();

  Color get _accent => _curriculum?.id == 'uk' ? _ukColor : _ngColor;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _otherSubjectCtrl.dispose();
    _topicCtrl.dispose();
    _inputCtrl.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() => _loadError = null);
    try {
      final list = await CommandCenterService.curricula();
      if (mounted) setState(() => _curricula = list);
    } catch (e) {
      if (mounted) setState(() => _loadError = e.toString().replaceFirst('Exception: ', ''));
    }
  }

  String get _subjectValue =>
      _subject == _otherSubject ? _otherSubjectCtrl.text.trim() : (_subject ?? '');

  bool get _canStart =>
      _curriculum != null &&
      _level != null &&
      _year != null &&
      _subjectValue.isNotEmpty &&
      _topicCtrl.text.trim().isNotEmpty;

  LearningPath _currentPath({String? topic}) => LearningPath(
        curriculum: _curriculum!.id,
        level: _level!,
        year: _year!,
        subject: _subjectValue,
        topic: topic ?? _topicCtrl.text.trim(),
      );

  Future<void> _suggest() async {
    if (_curriculum == null || _level == null || _year == null || _subjectValue.isEmpty) return;
    setState(() => _suggesting = true);
    try {
      final topics = await CommandCenterService.suggestTopics(_currentPath(topic: ''));
      if (mounted) setState(() => _suggestions = topics);
    } catch (_) {
      if (mounted) setState(() => _suggestions = []);
    } finally {
      if (mounted) setState(() => _suggesting = false);
    }
  }

  void _start() {
    setState(() {
      _path = _currentPath();
      _turns.clear();
      _sessionError = null;
    });
    _ask();
  }

  Future<void> _ask() async {
    setState(() {
      _waiting = true;
      _sessionError = null;
    });
    _scrollToEnd();
    try {
      final reply = await CommandCenterService.nextMessage(_path!, _turns);
      if (!mounted) return;
      setState(() => _turns.add(TutorTurn('assistant', reply)));
    } catch (e) {
      if (!mounted) return;
      setState(() => _sessionError = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _waiting = false);
      _scrollToEnd();
    }
  }

  void _send() {
    final text = _inputCtrl.text.trim();
    if (text.isEmpty || _waiting) return;
    _inputCtrl.clear();
    setState(() => _turns.add(TutorTurn('user', text)));
    _ask();
  }

  void _scrollToEnd() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) {
        _scroll.animateTo(_scroll.position.maxScrollExtent,
            duration: const Duration(milliseconds: 250), curve: Curves.easeOut);
      }
    });
  }

  Future<void> _open(String url) =>
      launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Command Center'),
        backgroundColor: _path != null ? _accent : AppColors.darkGreen,
        foregroundColor: Colors.white,
        actions: [
          if (_path != null)
            TextButton.icon(
              onPressed: () => setState(() => _path = null),
              icon: const Icon(Icons.tune, color: Colors.white),
              label: const Text('Edit path', style: TextStyle(color: Colors.white)),
            ),
        ],
      ),
      drawer: const AppNavDrawer(),
      body: !AppAuthState.isTeens
          ? const _Message(
              'The Command Center is part of AI Academy for Teens. Sign in with your teenskills.co.uk account to use it.')
          : _loadError != null
              ? _Message(_loadError!, onRetry: _load)
              : _curricula == null
                  ? const Center(child: CircularProgressIndicator())
                  : _path == null
                      ? _setup()
                      : _session(),
    );
  }

  // ---------------------------------------------------------------- setup

  Widget _setup() {
    final curricula = _curricula!;
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 720),
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text('AI Tutor Command Center',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold, color: AppColors.darkGreen)),
            const SizedBox(height: 6),
            const Text(
              'Set your learning path, then the tutor guides you one question at a time. '
              'It gives hints, not answers — and asks you to check facts in Copilot or NotebookLM.',
              style: TextStyle(fontSize: 15, height: 1.4),
            ),
            const SizedBox(height: 20),
            _stepTitle(1, 'Curriculum'),
            Row(
              children: [
                for (final c in curricula) ...[
                  Expanded(
                    child: _choiceCard(
                      title: c.label,
                      subtitle: c.id == 'ng' ? 'Primary 1 – SSS 3' : 'Years 1 – 11',
                      icon: Icons.flag,
                      color: c.id == 'uk' ? _ukColor : _ngColor,
                      selected: _curriculum?.id == c.id,
                      onTap: () => setState(() {
                        _curriculum = c;
                        _level = null;
                        _year = null;
                        _subject = null;
                        _suggestions = [];
                      }),
                    ),
                  ),
                  if (c != curricula.last) const SizedBox(width: 12),
                ],
              ],
            ),
            if (_curriculum != null) ...[
              const SizedBox(height: 20),
              _stepTitle(2, 'Level'),
              Row(
                children: [
                  for (final level in const ['Primary', 'Secondary']) ...[
                    Expanded(
                      child: _choiceCard(
                        title: level,
                        subtitle: level == 'Primary'
                            ? _curriculum!.primaryHint
                            : _curriculum!.secondaryHint,
                        icon: level == 'Primary' ? Icons.child_care : Icons.school,
                        color: _accent,
                        selected: _level == level,
                        onTap: () => setState(() {
                          _level = level;
                          _year = null;
                          _subject = null;
                          _suggestions = [];
                        }),
                      ),
                    ),
                    if (level == 'Primary') const SizedBox(width: 12),
                  ],
                ],
              ),
              if (_level != null) ...[
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  key: ValueKey('year-${_curriculum!.id}-$_level'),
                  initialValue: _year,
                  decoration: const InputDecoration(
                      labelText: 'Your year / class', border: OutlineInputBorder()),
                  items: [
                    for (final y in _curriculum!.years[_level] ?? const <String>[])
                      DropdownMenuItem(value: y, child: Text(y)),
                  ],
                  onChanged: (v) => setState(() => _year = v),
                ),
              ],
            ],
            if (_year != null) ...[
              const SizedBox(height: 20),
              _stepTitle(3, 'Subject'),
              DropdownButtonFormField<String>(
                key: ValueKey('subject-${_curriculum!.id}-$_level'),
                initialValue: _subject,
                isExpanded: true,
                decoration: const InputDecoration(
                    labelText: 'Subject / unit', border: OutlineInputBorder()),
                items: [
                  for (final s in _curriculum!.subjects[_level] ?? const <String>[])
                    DropdownMenuItem(value: s, child: Text(s, overflow: TextOverflow.ellipsis)),
                  const DropdownMenuItem(value: _otherSubject, child: Text('Other…')),
                ],
                onChanged: (v) => setState(() {
                  _subject = v;
                  _suggestions = [];
                }),
              ),
              if (_subject == _otherSubject) ...[
                const SizedBox(height: 12),
                TextField(
                  controller: _otherSubjectCtrl,
                  maxLength: 120,
                  decoration: const InputDecoration(
                      labelText: 'Type your subject', border: OutlineInputBorder()),
                  onChanged: (_) => setState(() {}),
                ),
              ],
            ],
            if (_subjectValue.isNotEmpty && _year != null) ...[
              const SizedBox(height: 20),
              _stepTitle(4, 'Topic'),
              TextField(
                controller: _topicCtrl,
                maxLength: 120,
                decoration: const InputDecoration(
                  labelText: 'The exact topic',
                  hintText: 'e.g. Quadratic equations, Photosynthesis',
                  border: OutlineInputBorder(),
                ),
                onChanged: (_) => setState(() {}),
              ),
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton.icon(
                  onPressed: _suggesting ? null : _suggest,
                  icon: _suggesting
                      ? const SizedBox(
                          width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                      : const Icon(Icons.lightbulb_outline),
                  label: Text(_suggesting ? 'Thinking of topics…' : 'Suggest topics for me'),
                ),
              ),
              if (_suggestions.isNotEmpty)
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final t in _suggestions)
                      ActionChip(
                        label: Text(t),
                        onPressed: () => setState(() => _topicCtrl.text = t),
                      ),
                  ],
                ),
            ],
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _canStart ? _start : null,
              icon: const Icon(Icons.play_arrow),
              label: const Text('Start the session'),
              style: ElevatedButton.styleFrom(
                backgroundColor: _accent,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 52),
              ),
            ),
            if (!_canStart)
              const Padding(
                padding: EdgeInsets.only(top: 8),
                child: Text('Pick all four to begin.',
                    textAlign: TextAlign.center, style: TextStyle(color: Colors.grey)),
              ),
          ],
        ),
      ),
    );
  }

  Widget _stepTitle(int n, String title) => Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Row(
          children: [
            CircleAvatar(
              radius: 13,
              backgroundColor: AppColors.darkGreen,
              child: Text('$n',
                  style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(width: 10),
            Text(title, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w600)),
          ],
        ),
      );

  Widget _choiceCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return Material(
      color: selected ? color.withValues(alpha: 0.1) : Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: selected ? color : Colors.grey.shade300, width: selected ? 2 : 1),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: color),
              const SizedBox(height: 8),
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              const SizedBox(height: 2),
              Text(subtitle, style: TextStyle(color: Colors.grey.shade700, fontSize: 13)),
            ],
          ),
        ),
      ),
    );
  }

  // -------------------------------------------------------------- session

  Widget _session() {
    final p = _path!;
    return Column(
      children: [
        Container(
          width: double.infinity,
          color: _accent.withValues(alpha: 0.08),
          padding: const EdgeInsets.fromLTRB(12, 10, 12, 6),
          child: Wrap(
            spacing: 6,
            runSpacing: 6,
            children: [
              _pathChip(_curriculum!.label, strong: true),
              _pathChip('${p.level} · ${p.year}'),
              _pathChip(p.subject),
              _pathChip(p.topic),
            ],
          ),
        ),
        Container(
          width: double.infinity,
          color: _accent.withValues(alpha: 0.08),
          padding: const EdgeInsets.fromLTRB(12, 0, 12, 10),
          child: Wrap(
            spacing: 8,
            runSpacing: 4,
            children: [
              OutlinedButton.icon(
                onPressed: () => _open('https://copilot.microsoft.com'),
                icon: const Icon(Icons.open_in_new, size: 16),
                label: const Text('Microsoft Copilot'),
              ),
              OutlinedButton.icon(
                onPressed: () => _open('https://notebooklm.google.com'),
                icon: const Icon(Icons.open_in_new, size: 16),
                label: const Text('Google NotebookLM'),
              ),
            ],
          ),
        ),
        Expanded(
          child: ListView(
            controller: _scroll,
            padding: const EdgeInsets.all(16),
            children: [
              for (final t in _turns) _bubble(t),
              if (_waiting)
                const Padding(
                  padding: EdgeInsets.all(12),
                  child: Row(children: [
                    SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)),
                    SizedBox(width: 10),
                    Text('The tutor is thinking…'),
                  ]),
                ),
              if (_sessionError != null)
                Card(
                  color: Colors.red.shade50,
                  child: ListTile(
                    leading: const Icon(Icons.error_outline, color: Colors.red),
                    title: Text(_sessionError!),
                    trailing: TextButton(onPressed: _ask, child: const Text('Retry')),
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
              children: [
                Expanded(
                  child: TextField(
                    controller: _inputCtrl,
                    minLines: 1,
                    maxLines: 4,
                    maxLength: 2000,
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _send(),
                    onChanged: (_) => setState(() {}),
                    decoration: const InputDecoration(
                      hintText: 'Type your answer…',
                      counterText: '',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton.filled(
                  onPressed: _waiting || _inputCtrl.text.trim().isEmpty ? null : _send,
                  style: IconButton.styleFrom(backgroundColor: _accent),
                  icon: const Icon(Icons.send),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _pathChip(String text, {bool strong = false}) => Chip(
        label: Text(text,
            style: TextStyle(
                fontSize: 12,
                color: strong ? Colors.white : Colors.black87,
                fontWeight: strong ? FontWeight.bold : FontWeight.normal)),
        backgroundColor: strong ? _accent : Colors.white,
        visualDensity: VisualDensity.compact,
        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      );

  Widget _bubble(TutorTurn t) {
    final mine = t.role == 'user';
    return Align(
      alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.82),
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 6),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            color: mine ? _accent : const Color(0xFFF1F4F2),
            borderRadius: BorderRadius.circular(14),
          ),
          child: mine
              ? Text(t.content, style: const TextStyle(color: Colors.white, fontSize: 15, height: 1.4))
              : HtmlWidget(
                  md.markdownToHtml(t.content),
                  textStyle: const TextStyle(fontSize: 15, height: 1.45),
                  onTapUrl: (url) => launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication),
                ),
        ),
      ),
    );
  }
}

class _Message extends StatelessWidget {
  final String text;
  final VoidCallback? onRetry;
  const _Message(this.text, {this.onRetry});

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(text, textAlign: TextAlign.center, style: const TextStyle(fontSize: 16)),
              if (onRetry != null) ...[
                const SizedBox(height: 16),
                ElevatedButton(onPressed: onRetry, child: const Text('Retry')),
              ],
            ],
          ),
        ),
      );
}
