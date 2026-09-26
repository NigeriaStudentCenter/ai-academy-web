import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:markdown/markdown.dart' as md;
import 'package:url_launcher/url_launcher.dart';

import '../../core/auth/app_auth_state.dart';
import '../../core/theme/app_colors.dart';
import '../../core/tutor/student_hub_service.dart';
import '../../widgets/app_nav_drawer.dart';

const _icons = <String, IconData>{
  'school': Icons.school,
  'workspace_premium': Icons.workspace_premium,
  'work': Icons.work,
  'celebration': Icons.celebration,
  'home': Icons.home,
  'web': Icons.web,
  'mail': Icons.mail,
  'campaign': Icons.campaign,
  'person_search': Icons.person_search,
  'smart_toy': Icons.smart_toy,
  'handshake': Icons.handshake,
};

/// What differs between the two professional hubs.
class HubConfig {
  final String id; // 'student' | 'business'
  final String title;
  final String headline;
  final String intro;
  final String footnote;

  const HubConfig({
    required this.id,
    required this.title,
    required this.headline,
    required this.intro,
    required this.footnote,
  });

  /// Five live-web tools: Study Companion, Scholarship, Jobs, Social & Gigs
  /// and Accommodation (student.html).
  static const student = HubConfig(
    id: 'student',
    title: 'Student Success Hub',
    headline: 'Ace your studies. Fund them. Live them fully.',
    intro:
        'Five tools that search the live web for you — real sources, scholarships, '
        'jobs, events and places to live, with links you can act on today.',
    footnote:
        'Every tool searches the web in real time — always confirm details on the official link.',
  );

  /// Six marketing tools, one per service on business.html.
  static const business = HubConfig(
    id: 'business',
    title: 'Business Marketing Hub',
    headline: 'All your marketing, handled — without hiring a team.',
    intro:
        'Landing pages, emails, social content, lead generation, a 24/7 chatbot '
        'and follow-up that closes — created for your business in minutes.',
    footnote:
        'Review everything before you publish or send — only promise what your business really delivers.',
  );
}

/// A professional learner's hub (Student Success Hub or Business Marketing
/// Hub): a list of AI tools, each a short form that returns a result.
class StudentHubPage extends StatefulWidget {
  final HubConfig hub;
  const StudentHubPage({super.key, this.hub = HubConfig.student});

  @override
  State<StudentHubPage> createState() => _StudentHubPageState();
}

class _StudentHubPageState extends State<StudentHubPage> {
  HubCatalog? _catalog;
  String? _loadError;
  HubTool? _tool; // the open tool (null = the hub's tool list)

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loadError = null);
    try {
      final catalog = await StudentHubService.catalog(widget.hub.id);
      if (mounted) setState(() => _catalog = catalog);
    } catch (e) {
      if (mounted) {
        setState(
            () => _loadError = e.toString().replaceFirst('Exception: ', ''));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final Widget body;
    if (!AppAuthState.isProfessional) {
      body = _Centered(
          'The ${widget.hub.title} is part of the AI Academy. Teens have the Command Center.');
    } else if (_loadError != null) {
      body = _Centered(_loadError!, onRetry: _load);
    } else if (_catalog == null) {
      body = const Center(child: CircularProgressIndicator());
    } else if (_tool == null) {
      body = _toolList(_catalog!);
    } else {
      body = _ToolRunner(
          key: ValueKey(_tool!.id), hub: widget.hub.id, tool: _tool!);
    }

    return PopScope(
      canPop: _tool == null,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) setState(() => _tool = null);
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(_tool?.name ?? widget.hub.title),
          backgroundColor: AppColors.darkGreen,
          foregroundColor: Colors.white,
          leading: _tool == null
              ? null
              : IconButton(
                  icon: const Icon(Icons.arrow_back),
                  tooltip: 'All tools',
                  onPressed: () => setState(() => _tool = null),
                ),
        ),
        drawer: _tool == null ? const AppNavDrawer() : null,
        body: body,
      ),
    );
  }

  Widget _toolList(HubCatalog catalog) {
    final offer = catalog.doneForYou;
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 720),
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text(widget.hub.headline,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold, color: AppColors.darkGreen)),
            const SizedBox(height: 6),
            Text(widget.hub.intro,
                style: const TextStyle(fontSize: 15, height: 1.4)),
            const SizedBox(height: 16),
            for (final t in catalog.tools)
              Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                  side: BorderSide(color: Colors.grey.shade300),
                ),
                elevation: 0,
                child: ListTile(
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  leading: CircleAvatar(
                    backgroundColor: AppColors.darkGreen.withValues(alpha: 0.1),
                    child: Icon(_icons[t.icon] ?? Icons.auto_awesome,
                        color: AppColors.darkGreen),
                  ),
                  title: Text(t.name,
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(t.summary),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => setState(() => _tool = t),
                ),
              ),
            if (offer != null) ...[
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                      colors: [Color(0xFF15803D), Color(0xFF14532D)]),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(offer.title,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    Text(offer.text,
                        style: const TextStyle(
                            color: Colors.white, fontSize: 14.5, height: 1.4)),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: () => launchUrl(Uri(
                        scheme: 'mailto',
                        path: offer.email,
                        queryParameters: {'subject': offer.subject},
                      )),
                      icon: const Icon(Icons.calendar_month),
                      label: const Text('Book your free call'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFF15803D),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
            ],
            const SizedBox(height: 4),
            Text(widget.hub.footnote,
                style: TextStyle(color: Colors.grey.shade700, fontSize: 13)),
          ],
        ),
      ),
    );
  }
}

/// One tool: its form, then the result.
class _ToolRunner extends StatefulWidget {
  final String hub;
  final HubTool tool;
  const _ToolRunner({super.key, required this.hub, required this.tool});

  @override
  State<_ToolRunner> createState() => _ToolRunnerState();
}

class _ToolRunnerState extends State<_ToolRunner> {
  final Map<String, TextEditingController> _text = {};
  final Map<String, String> _select = {};
  HubBrief? _brief;
  bool _running = false;
  String? _result;
  String? _error;

  @override
  void initState() {
    super.initState();
    for (final f in widget.tool.fields) {
      if (f.type == 'select') {
        _select[f.id] = f.options.isNotEmpty ? f.options.first : '';
      } else if (f.type != 'file') {
        _text[f.id] = TextEditingController()
          ..addListener(() => setState(() {}));
      }
    }
  }

  @override
  void dispose() {
    for (final c in _text.values) {
      c.dispose();
    }
    super.dispose();
  }

  bool get _ready => widget.tool.fields
      .where((f) => f.required)
      .every((f) => (_text[f.id]?.text.trim() ?? '').isNotEmpty);

  Future<void> _pickBrief() async {
    final picked = await FilePicker.pickFiles(
      type: FileType.custom,
      allowedExtensions: const [
        'pdf',
        'png',
        'jpg',
        'jpeg',
        'webp',
        'gif',
        'txt'
      ],
    );
    if (picked.isEmpty) return;
    final file = picked.first;
    if ((await file.length() ?? 0) > 5 * 1024 * 1024) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('That file is too large (5 MB max).')));
      }
      return;
    }
    final bytes = await file.readAsBytes();
    if (mounted) setState(() => _brief = HubBrief(file.name, bytes));
  }

  Future<void> _run() async {
    FocusScope.of(context).unfocus();
    setState(() {
      _running = true;
      _error = null;
      _result = null;
    });
    try {
      final answers = {
        for (final e in _text.entries) e.key: e.value.text,
        ..._select,
      };
      final text = await StudentHubService.run(
          widget.hub, widget.tool.id, answers,
          brief: _brief);
      if (!mounted) return;
      setState(() {
        _result = text.isEmpty ? null : text;
        if (text.isEmpty) _error = 'No result came back — please try again.';
      });
    } catch (e) {
      if (mounted) {
        setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
      }
    } finally {
      if (mounted) setState(() => _running = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tool = widget.tool;
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 760),
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text(tool.summary, style: TextStyle(color: Colors.grey.shade700)),
            const SizedBox(height: 16),
            for (final f in tool.fields) ...[
              _field(f),
              const SizedBox(height: 14),
            ],
            ElevatedButton.icon(
              onPressed: _running || !_ready ? null : _run,
              icon: _running
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white))
                  : const Icon(Icons.search),
              label: Text(_running ? 'Working on it…' : 'Run ${tool.name}'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.darkGreen,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 52),
              ),
            ),
            if (_running)
              const Padding(
                padding: EdgeInsets.only(top: 8),
                child: Text('This usually takes 20–60 seconds.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey)),
              ),
            if (tool.note.isNotEmpty) ...[
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF8E6),
                  borderRadius: BorderRadius.circular(10),
                  border: const Border(
                      left: BorderSide(color: AppColors.accentGold, width: 4)),
                ),
                child: Text(tool.note,
                    style: const TextStyle(fontSize: 13.5, height: 1.4)),
              ),
            ],
            if (_error != null) ...[
              const SizedBox(height: 14),
              Card(
                color: Colors.red.shade50,
                child: ListTile(
                  leading: const Icon(Icons.error_outline, color: Colors.red),
                  title: Text(_error!),
                ),
              ),
            ],
            if (_result != null) ...[
              const SizedBox(height: 18),
              Row(
                children: [
                  const Expanded(
                    child: Text('Your results',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold)),
                  ),
                  TextButton.icon(
                    onPressed: () async {
                      await Clipboard.setData(ClipboardData(text: _result!));
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Copied')));
                      }
                    },
                    icon: const Icon(Icons.copy, size: 18),
                    label: const Text('Copy'),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F4F2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: HtmlWidget(
                  md.markdownToHtml(_result!,
                      extensionSet: md.ExtensionSet.gitHubWeb),
                  textStyle: const TextStyle(fontSize: 15, height: 1.45),
                  onTapUrl: (url) => launchUrl(Uri.parse(url),
                      mode: LaunchMode.externalApplication),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _field(HubField f) {
    switch (f.type) {
      case 'select':
        return DropdownButtonFormField<String>(
          initialValue: _select[f.id],
          isExpanded: true,
          decoration: InputDecoration(
              labelText: f.label, border: const OutlineInputBorder()),
          items: [
            for (final o in f.options)
              DropdownMenuItem(
                  value: o, child: Text(o, overflow: TextOverflow.ellipsis)),
          ],
          onChanged: (v) => setState(() => _select[f.id] = v ?? ''),
        );
      case 'textarea':
        return TextField(
          controller: _text[f.id],
          minLines: 3,
          maxLines: 8,
          maxLength: 12000,
          decoration: InputDecoration(
            labelText: f.label,
            hintText: f.hint,
            alignLabelWithHint: true,
            border: const OutlineInputBorder(),
          ),
        );
      case 'file':
        return OutlinedButton.icon(
          onPressed: _pickBrief,
          icon: Icon(_brief == null ? Icons.upload_file : Icons.check_circle),
          label: Text(
              _brief == null ? f.label : 'Brief attached: ${_brief!.name}',
              overflow: TextOverflow.ellipsis),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 48),
            alignment: Alignment.centerLeft,
          ),
        );
      default:
        return TextField(
          controller: _text[f.id],
          maxLength: 200,
          decoration: InputDecoration(
            labelText: f.required ? '${f.label} *' : f.label,
            hintText: f.hint,
            counterText: '',
            border: const OutlineInputBorder(),
          ),
        );
    }
  }
}

class _Centered extends StatelessWidget {
  final String text;
  final VoidCallback? onRetry;
  const _Centered(this.text, {this.onRetry});

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(text,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16)),
              if (onRetry != null) ...[
                const SizedBox(height: 16),
                ElevatedButton(onPressed: onRetry, child: const Text('Retry')),
              ],
            ],
          ),
        ),
      );
}
