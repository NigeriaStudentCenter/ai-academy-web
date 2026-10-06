import 'package:flutter/material.dart';

import '../../core/k12/k12_service.dart';
import '../../widgets/app_nav_drawer.dart';
import 'k12_widgets.dart';
import 'parent_dashboard_page.dart';
import 'skill_tree_page.dart';

/// Curriculum Tutor: learner profiles (13+) on the US curriculum (grade and
/// state) or Cambridge International (stage).
class UsK12HomePage extends StatefulWidget {
  const UsK12HomePage({super.key});

  @override
  State<UsK12HomePage> createState() => _UsK12HomePageState();
}

class _UsK12HomePageState extends State<UsK12HomePage> {
  K12Meta? _meta;
  List<K12Learner>? _learners;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _error = null);
    try {
      final meta = await K12Service.meta();
      final learners = await K12Service.learners();
      if (mounted) {
        setState(() {
          _meta = meta;
          _learners = learners;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _error = errorText(e));
    }
  }

  Future<void> _edit([K12Learner? learner]) async {
    final saved = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      builder: (_) => _LearnerForm(meta: _meta!, learner: learner),
    );
    if (saved == true) _load();
  }

  Future<void> _delete(K12Learner l) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: Text('Remove ${l.nickname}?'),
        content: const Text(
            'This deletes their progress, quiz scores and activity. It cannot be undone.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Cancel')),
          FilledButton(
              style: FilledButton.styleFrom(backgroundColor: k12Red),
              onPressed: () => Navigator.pop(c, true),
              child: const Text('Remove')),
        ],
      ),
    );
    if (ok != true) return;
    try {
      await K12Service.deleteLearner(l.id);
      _load();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(errorText(e))));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Curriculum Tutor'),
        backgroundColor: k12Blue,
        foregroundColor: Colors.white,
      ),
      drawer: const AppNavDrawer(),
      floatingActionButton: _meta == null || (_learners ?? []).isEmpty
          ? null
          : FloatingActionButton.extended(
              backgroundColor: k12Red,
              foregroundColor: Colors.white,
              onPressed: () => _edit(),
              icon: const Icon(Icons.person_add_alt_1),
              label: const Text('Add learner'),
            ),
      body: _error != null
          ? ErrorRetry(_error!, _load)
          : _learners == null
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(onRefresh: _load, child: _body()),
    );
  }

  Widget _body() {
    final meta = _meta!;
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: k12Soft, borderRadius: BorderRadius.circular(14)),
          child: const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Learning mapped to your curriculum',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: k12Blue)),
            SizedBox(height: 6),
            Text(
              'United States: Common Core, NGSS and C3 skill trees adjusted for your state (grades 8–12).\n'
              'Cambridge International: Lower Secondary, IGCSE and AS & A Level, organised by the official '
              'syllabus codes, with exam-style questions marked against mark schemes.\n'
              'For learners aged 13 and over.',
              style: TextStyle(height: 1.4),
            ),
          ]),
        ),
        const SizedBox(height: 20),
        if (_learners!.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 24),
            child: Column(children: [
              const Icon(Icons.family_restroom, size: 48, color: k12Blue),
              const SizedBox(height: 10),
              const Text('Add a learner to get started',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              const Text(
                'A first name or nickname and their curriculum — US grade and state, or Cambridge stage. '
                'Learners must be 13 or older.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.black54),
              ),
              const SizedBox(height: 14),
              FilledButton.icon(
                style: FilledButton.styleFrom(backgroundColor: k12Red),
                onPressed: () => _edit(),
                icon: const Icon(Icons.person_add_alt_1),
                label: const Text('Add learner'),
              ),
            ]),
          ),
        for (final l in _learners!)
          Card(
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 8, 12),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  CircleAvatar(
                    backgroundColor: k12Blue,
                    foregroundColor: Colors.white,
                    child: Text(l.nickname.characters.first.toUpperCase()),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(l.nickname,
                          style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
                      Text(meta.learnerLine(l),
                          style: const TextStyle(color: Colors.black54)),
                    ]),
                  ),
                  PopupMenuButton<String>(
                    onSelected: (v) => v == 'edit' ? _edit(l) : _delete(l),
                    itemBuilder: (_) => const [
                      PopupMenuItem(value: 'edit', child: Text('Edit learner')),
                      PopupMenuItem(value: 'delete', child: Text('Remove learner')),
                    ],
                  ),
                ]),
                const SizedBox(height: 12),
                Row(children: [
                  Expanded(
                    child: FilledButton.icon(
                      style: FilledButton.styleFrom(backgroundColor: k12Blue),
                      onPressed: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (_) => SkillTreePage(meta: meta, learner: l))),
                      icon: const Icon(Icons.account_tree_outlined),
                      label: const Text('Learn'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(foregroundColor: k12Blue),
                      onPressed: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (_) => ParentDashboardPage(meta: meta, learner: l))),
                      icon: const Icon(Icons.insights_outlined),
                      label: const Text('Parent view'),
                    ),
                  ),
                  const SizedBox(width: 8),
                ]),
              ]),
            ),
          ),
      ],
    );
  }
}

class _LearnerForm extends StatefulWidget {
  final K12Meta meta;
  final K12Learner? learner;
  const _LearnerForm({required this.meta, this.learner});

  @override
  State<_LearnerForm> createState() => _LearnerFormState();
}

class _LearnerFormState extends State<_LearnerForm> {
  late final _name = TextEditingController(text: widget.learner?.nickname ?? '');
  late String _curriculum = widget.learner?.curriculum ?? 'us';
  late String? _grade = widget.learner?.grade.isNotEmpty == true ? widget.learner!.grade : null;
  late String? _state = widget.learner?.state.isNotEmpty == true ? widget.learner!.state : null;
  late String? _stage = widget.learner?.stage.isNotEmpty == true ? widget.learner!.stage : null;
  bool _over13 = false;
  bool _saving = false;
  String? _error;

  bool get _isNew => widget.learner == null;

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  bool get _ready =>
      _name.text.trim().isNotEmpty &&
      (_curriculum == 'cambridge' ? _stage != null : _grade != null && _state != null) &&
      (!_isNew || _over13) &&
      !_saving;

  Future<void> _save() async {
    setState(() {
      _saving = true;
      _error = null;
    });
    try {
      await K12Service.saveLearner(
        id: widget.learner?.id,
        nickname: _name.text.trim(),
        curriculum: _curriculum,
        grade: _curriculum == 'us' ? _grade! : '',
        state: _curriculum == 'us' ? _state! : '',
        stage: _curriculum == 'cambridge' ? _stage! : '',
        ageConfirmed: _over13,
      );
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      if (mounted) setState(() => _error = errorText(e));
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final meta = widget.meta;
    return Padding(
      padding: EdgeInsets.fromLTRB(20, 20, 20, 20 + MediaQuery.of(context).viewInsets.bottom),
      child: SingleChildScrollView(
        child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(_isNew ? 'Add a learner' : 'Edit ${widget.learner!.nickname}',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
          const SizedBox(height: 16),
          TextField(
            controller: _name,
            maxLength: 24,
            textCapitalization: TextCapitalization.words,
            onChanged: (_) => setState(() {}),
            decoration: const InputDecoration(
              labelText: 'First name or nickname',
              helperText: 'No surnames, emails or phone numbers.',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          SegmentedButton<String>(
            segments: const [
              ButtonSegment(value: 'us', label: Text('United States'), icon: Icon(Icons.flag_outlined)),
              ButtonSegment(value: 'cambridge', label: Text('Cambridge'), icon: Icon(Icons.public)),
            ],
            selected: {_curriculum},
            onSelectionChanged: (v) => setState(() => _curriculum = v.first),
          ),
          const SizedBox(height: 12),
          if (_curriculum == 'us') ...[
            DropdownButtonFormField<String>(
              initialValue: _grade,
              decoration: const InputDecoration(labelText: 'Grade level', border: OutlineInputBorder()),
              items: [for (final g in meta.grades) DropdownMenuItem(value: g.id, child: Text(g.label))],
              onChanged: (v) => setState(() => _grade = v),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              initialValue: _state,
              isExpanded: true,
              decoration: const InputDecoration(labelText: 'State', border: OutlineInputBorder()),
              items: [for (final s in meta.states) DropdownMenuItem(value: s.id, child: Text(s.label))],
              onChanged: (v) => setState(() => _state = v),
            ),
          ] else
            DropdownButtonFormField<String>(
              initialValue: _stage,
              isExpanded: true,
              itemHeight: 64,
              decoration: const InputDecoration(labelText: 'Cambridge stage', border: OutlineInputBorder()),
              items: [
                for (final s in meta.camStages)
                  DropdownMenuItem(
                    value: s.id,
                    child: Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(s.label),
                      Text(s.detail, style: const TextStyle(fontSize: 12, color: Colors.black54)),
                    ]),
                  ),
              ],
              onChanged: (v) => setState(() => _stage = v),
            ),
          if (_isNew) ...[
            const SizedBox(height: 8),
            CheckboxListTile(
              value: _over13,
              onChanged: (v) => setState(() => _over13 = v ?? false),
              contentPadding: EdgeInsets.zero,
              controlAffinity: ListTileControlAffinity.leading,
              activeColor: k12Blue,
              title: const Text('This learner is 13 or older'),
              subtitle: const Text('AI Academy is for learners aged 13 and over.'),
            ),
          ],
          if (_error != null) ...[
            const SizedBox(height: 10),
            Text(_error!, style: const TextStyle(color: k12Red)),
          ],
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              style: FilledButton.styleFrom(backgroundColor: k12Blue, padding: const EdgeInsets.symmetric(vertical: 14)),
              onPressed: _ready ? _save : null,
              child: Text(_saving ? 'Saving…' : 'Save'),
            ),
          ),
        ]),
      ),
    );
  }
}
