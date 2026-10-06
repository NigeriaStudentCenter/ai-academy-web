import 'package:flutter/material.dart';

import '../../core/k12/k12_service.dart';
import 'k12_widgets.dart';

class _Turn {
  final String role; // user | assistant
  final String content;
  final List<String> tags;
  const _Turn(this.role, this.content, [this.tags = const []]);
}

/// The tutor for one skill, in the learner's chosen style and level.
class TutorPage extends StatefulWidget {
  final K12Learner learner;
  final K12Tree tree;
  final K12Skill skill;
  final String micro;
  final String style;
  final String styleLabel;
  final String tier;
  final String tierLabel;
  const TutorPage({
    super.key,
    required this.learner,
    required this.tree,
    required this.skill,
    required this.micro,
    required this.style,
    required this.styleLabel,
    required this.tier,
    required this.tierLabel,
  });

  @override
  State<TutorPage> createState() => _TutorPageState();
}

class _TutorPageState extends State<TutorPage> {
  final List<_Turn> _turns = [];
  final _input = TextEditingController();
  final _scroll = ScrollController();
  bool _waiting = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _ask();
  }

  @override
  void dispose() {
    _input.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _ask() async {
    setState(() {
      _waiting = true;
      _error = null;
    });
    try {
      final reply = await K12Service.learn(widget.learner.id, widget.tree.subject, widget.skill.id,
          micro: widget.micro,
          style: widget.style,
          tier: widget.tier,
          turns: [for (final t in _turns) {'role': t.role, 'content': t.content}]);
      if (mounted) setState(() => _turns.add(_Turn('assistant', reply.text, reply.tags)));
    } catch (e) {
      if (mounted) setState(() => _error = errorText(e));
    } finally {
      if (mounted) setState(() => _waiting = false);
      _toBottom();
    }
  }

  void _toBottom() => WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_scroll.hasClients) {
          _scroll.animateTo(_scroll.position.maxScrollExtent,
              duration: const Duration(milliseconds: 250), curve: Curves.easeOut);
        }
      });

  void _send([String? text]) {
    final t = (text ?? _input.text).trim();
    if (t.isEmpty || _waiting) return;
    _input.clear();
    setState(() => _turns.add(_Turn('user', t)));
    _ask();
  }

  Future<void> _stuck() async {
    // Tell the parent dashboard, then ask for a hint.
    K12Service.stuck(widget.learner.id, widget.tree.subject, widget.skill.id).ignore();
    _send("I'm stuck. Can you give me a hint?");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.micro.isNotEmpty ? widget.micro : widget.skill.name,
            maxLines: 1, overflow: TextOverflow.ellipsis),
        backgroundColor: k12Blue,
        foregroundColor: Colors.white,
      ),
      body: Column(children: [
        Container(
          width: double.infinity,
          color: k12Soft,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text('${widget.styleLabel} · ${widget.tierLabel} · ${widget.tree.gradeLabel}',
              style: const TextStyle(fontSize: 12.5, color: k12Blue)),
        ),
        Expanded(
          child: ListView(
            controller: _scroll,
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
            children: [
              for (final t in _turns) _bubble(t),
              if (_waiting)
                const Padding(
                  padding: EdgeInsets.all(12),
                  child: Row(children: [
                    SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)),
                    SizedBox(width: 10),
                    Text('Thinking…'),
                  ]),
                ),
              if (_error != null) ErrorRetry(_error!, _ask),
            ],
          ),
        ),
        SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 4, 12, 8),
            child: Column(children: [
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton.icon(
                  onPressed: _waiting || _turns.isEmpty ? null : _stuck,
                  icon: const Icon(Icons.support_outlined, size: 18),
                  label: const Text("I'm stuck"),
                  style: TextButton.styleFrom(foregroundColor: k12Red),
                ),
              ),
              Row(children: [
                Expanded(
                  child: TextField(
                    controller: _input,
                    minLines: 1,
                    maxLines: 4,
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _send(),
                    decoration: InputDecoration(
                      hintText: 'Type your answer…',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton.filled(
                  onPressed: _waiting ? null : _send,
                  icon: const Icon(Icons.send),
                  style: IconButton.styleFrom(backgroundColor: k12Blue),
                ),
              ]),
            ]),
          ),
        ),
      ]),
    );
  }

  Widget _bubble(_Turn t) {
    final mine = t.role == 'user';
    return Align(
      alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.85),
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 6),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            color: mine ? k12Blue : const Color(0xFFF1F4F2),
            borderRadius: BorderRadius.circular(14),
          ),
          child: mine
              ? Text(t.content, style: const TextStyle(color: Colors.white, fontSize: 15, height: 1.4))
              : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  MarkdownText(t.content),
                  if (t.tags.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    CodeChips(t.tags),
                  ],
                ]),
        ),
      ),
    );
  }
}
