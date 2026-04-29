import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../services/curriculum_registry.dart';
import '../../services/curriculum_state_service.dart';
import '../../widgets/app_nav_drawer.dart';

class CurriculumSelectorPage extends StatefulWidget {
  const CurriculumSelectorPage({super.key});

  @override
  State<CurriculumSelectorPage> createState() => _CurriculumSelectorPageState();
}

class _CurriculumSelectorPageState extends State<CurriculumSelectorPage> {
  String? selectedTrack;
  String? selectedProgram;
  String? selectedSubject;
  String? selectedTopic;

  bool _loadingSaved = true;

  @override
  void initState() {
    super.initState();
    _loadSavedSelection();
  }

  bool get _hasFullSelection =>
      selectedTrack != null &&
      selectedProgram != null &&
      selectedSubject != null &&
      selectedTopic != null;

  Future<void> _loadSavedSelection() async {
    final saved = await CurriculumStateService.loadSelection();
    final registry = CurriculumRegistry.registry;

    if (!mounted) return;

    if (saved == null) {
      setState(() => _loadingSaved = false);
      return;
    }

    // Convert to safe strings
    String? track = (saved["track"] ?? "").toString().trim();
    String? program = (saved["program"] ?? "").toString().trim();
    String? subject = (saved["subject"] ?? "").toString().trim();
    String? topic = (saved["topic"] ?? "").toString().trim();

    // Normalize empty strings to null
    if (track.isEmpty) track = null;
    if (program.isEmpty) program = null;
    if (subject.isEmpty) subject = null;
    if (topic.isEmpty) topic = null;

    // ✅ VALIDATION (degrade gracefully)
    // Track must exist
    if (track == null || !registry.containsKey(track)) {
      await CurriculumStateService.clearSelection();
      setState(() {
        selectedTrack = null;
        selectedProgram = null;
        selectedSubject = null;
        selectedTopic = null;
        _loadingSaved = false;
      });

      _showInfo(
        "Your saved learning path is no longer available. Please choose a new one.",
      );
      return;
    }

    // Program must exist under track
    final programsMap = registry[track];
    if (program == null ||
        programsMap is! Map<String, dynamic> ||
        !programsMap.containsKey(program)) {
      // Keep track only; clear deeper levels
      await CurriculumStateService.clearSelection();

      setState(() {
        selectedTrack = track;
        selectedProgram = null;
        selectedSubject = null;
        selectedTopic = null;
        _loadingSaved = false;
      });

      _showInfo(
        "Your saved program is no longer available. Please reselect program, subject, and topic.",
      );
      return;
    }

    // Subject must exist under program
    final programNode = programsMap[program];
    final subjectsNode =
        (programNode is Map<String, dynamic>) ? programNode["subjects"] : null;

    if (subject == null ||
        subjectsNode is! Map<String, dynamic> ||
        !subjectsNode.containsKey(subject)) {
      await CurriculumStateService.clearSelection();

      setState(() {
        selectedTrack = track;
        selectedProgram = program;
        selectedSubject = null;
        selectedTopic = null;
        _loadingSaved = false;
      });

      _showInfo(
        "Your saved subject is no longer available. Please reselect subject and topic.",
      );
      return;
    }

    // Topic must exist in subject topics list
    final topicsList = subjectsNode[subject];
    final topics =
        topicsList is List ? topicsList.map((e) => e.toString()).toList() : <String>[];

    if (topic == null || !topics.contains(topic)) {
      await CurriculumStateService.clearSelection();

      setState(() {
        selectedTrack = track;
        selectedProgram = program;
        selectedSubject = subject;
        selectedTopic = null;
        _loadingSaved = false;
      });

      _showInfo(
        "Your saved topic is no longer available. Please choose a new topic.",
      );
      return;
    }

    // ✅ If everything is valid, apply it
    setState(() {
      selectedTrack = track;
      selectedProgram = program;
      selectedSubject = subject;
      selectedTopic = topic;
      _loadingSaved = false;
    });
  }

  void _showInfo(String message) {
    // Avoid snackbar during initial frame if context is not ready
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message)),
      );
    });
  }

  Future<void> _clearSelection() async {
    await CurriculumStateService.clearSelection();

    if (!mounted) return;
    setState(() {
      selectedTrack = null;
      selectedProgram = null;
      selectedSubject = null;
      selectedTopic = null;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Learning path cleared.")),
    );
  }

  Future<void> _saveSelection() async {
    if (!_hasFullSelection) return;

    await CurriculumStateService.saveSelection(
      track: selectedTrack!,
      program: selectedProgram!,
      subject: selectedSubject!,
      topic: selectedTopic!,
    );
  }

  void _goToCourse() {
    // Course page can read from saved selection later (stable).
    Get.offAllNamed("/course");
  }

  void _goToChat() {
    Get.toNamed(
      "/chat",
      arguments: {
        "track": selectedTrack,
        "program": selectedProgram,
        "subject": selectedSubject,
        "topic": selectedTopic,
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final registry = CurriculumRegistry.registry;

    final List<String> tracks = registry.keys.toList();

    final List<String> programs = (selectedTrack == null)
        ? []
        : (registry[selectedTrack!] as Map<String, dynamic>).keys.toList();

    final List<String> subjects =
        (selectedTrack == null || selectedProgram == null)
            ? []
            : ((registry[selectedTrack!][selectedProgram!]["subjects"]
                    as Map<String, dynamic>)
                .keys
                .toList());

    final List<String> topics =
        (selectedTrack == null || selectedProgram == null || selectedSubject == null)
            ? []
            : List<String>.from(
                registry[selectedTrack!][selectedProgram!]["subjects"][selectedSubject!],
              );

    return Scaffold(
      drawer: const AppNavDrawer(),
      appBar: AppBar(
        title: const Text("Choose Learning Path"),
        actions: [
          if (_hasFullSelection)
            IconButton(
              tooltip: "Clear selection",
              icon: const Icon(Icons.delete_outline),
              onPressed: _clearSelection,
            ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ✅ Saved path card (recommended UX)
            if (_loadingSaved)
              const LinearProgressIndicator()
            else if (_hasFullSelection)
              Card(
                elevation: 3,
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Saved learning path",
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text("Track: $selectedTrack"),
                      Text("Program: $selectedProgram"),
                      Text("Subject: $selectedSubject"),
                      Text("Topic: $selectedTopic"),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () async {
                                await _saveSelection();
                                _goToCourse(); // ✅ Course-first
                              },
                              icon: const Icon(Icons.school),
                              label: const Text("Continue"),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () async {
                                await _saveSelection();
                                _goToChat(); // optional jump to tutor
                              },
                              icon: const Icon(Icons.chat),
                              label: const Text("AI Tutor"),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

            const SizedBox(height: 16),

            const Text(
              "You can edit your learning path below.",
              style: TextStyle(fontWeight: FontWeight.w500),
            ),

            const SizedBox(height: 12),

            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: "Track"),
              value: selectedTrack,
              items: tracks
                  .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                  .toList(),
              onChanged: (v) {
                setState(() {
                  selectedTrack = v;
                  selectedProgram = null;
                  selectedSubject = null;
                  selectedTopic = null;
                });
              },
            ),

            const SizedBox(height: 16),

            if (programs.isNotEmpty)
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: "Program"),
                value: selectedProgram,
                items: programs
                    .map((p) => DropdownMenuItem(value: p, child: Text(p)))
                    .toList(),
                onChanged: (v) {
                  setState(() {
                    selectedProgram = v;
                    selectedSubject = null;
                    selectedTopic = null;
                  });
                },
              ),

            const SizedBox(height: 16),

            if (subjects.isNotEmpty)
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: "Subject"),
                value: selectedSubject,
                items: subjects
                    .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                    .toList(),
                onChanged: (v) {
                  setState(() {
                    selectedSubject = v;
                    selectedTopic = null;
                  });
                },
              ),

            const SizedBox(height: 16),

            if (topics.isNotEmpty)
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: "Topic"),
                value: selectedTopic,
                items: topics
                    .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                    .toList(),
                onChanged: (v) {
                  setState(() => selectedTopic = v);
                },
              ),

            const Spacer(),

            // ✅ Primary CTA: Start Learning → Course page
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _hasFullSelection
                    ? () async {
                        await _saveSelection();
                        _goToCourse();
                      }
                    : null,
                child: const Text("Start Learning"),
              ),
            ),

            const SizedBox(height: 10),

            // ✅ Secondary CTA: Jump straight to AI Tutor
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: _hasFullSelection
                    ? () async {
                        await _saveSelection();
                        _goToChat();
                      }
                    : null,
                child: const Text("Open AI Tutor"),
              ),
            ),

            const SizedBox(height: 6),
          ],
        ),
      ),
    );
  }
}
