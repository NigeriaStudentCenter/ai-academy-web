import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../services/curriculum_state_service.dart';
import 'package:ai_academy/services/curriculum_progress_service.dart';

class ProgressDashboardPage extends StatefulWidget {
  const ProgressDashboardPage({super.key});

  @override
  State<ProgressDashboardPage> createState() => _ProgressDashboardPageState();
}

class _ProgressDashboardPageState extends State<ProgressDashboardPage> {
  Map<String, dynamic>? curriculum;

  double completion = 0;
  String? nextTopic;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final saved = await CurriculumStateService.loadSelection();

    if (!mounted) return;

    if (saved == null) {
      setState(() {
        curriculum = null;
        completion = 0;
        nextTopic = null;
      });
      return;
    }

    final track = (saved["track"] ?? "").toString();
    final program = (saved["program"] ?? "").toString();
    final subject = (saved["subject"] ?? "").toString();

    if (track.isEmpty || program.isEmpty || subject.isEmpty) {
      setState(() {
        curriculum = saved;
        completion = 0;
        nextTopic = null;
      });
      return;
    }

    final percent = await CurriculumProgressService.completionPercentage(
      track: track,
      program: program,
      subject: subject,
    );

    final next = await CurriculumProgressService.nextTopic(
      track: track,
      program: program,
      subject: subject,
    );

    if (!mounted) return;
    setState(() {
      curriculum = saved;
      completion = percent;
      nextTopic = next;
    });
  }

  /// Converts a label into a route-safe slug.
  /// Adjust this later if your real course IDs are mapped differently.
  String _slugify(String value) {
    final slug = value
        .trim()
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
        .replaceAll(RegExp(r'^-+|-+$'), '');

    return slug.isEmpty ? 'flutter-ai' : slug;
  }

  /// Best-effort course route from saved curriculum.
  /// Falls back to flutter-ai if we cannot resolve something safer yet.
  String _resolveCourseId() {
    if (nextTopic != null && nextTopic!.trim().isNotEmpty) {
      return _slugify(nextTopic!);
    }

    final subject = (curriculum?["subject"] ?? "").toString();
    if (subject.trim().isNotEmpty) {
      return _slugify(subject);
    }

    return 'flutter-ai';
  }

  @override
  Widget build(BuildContext context) {
    // Empty state + CTA buttons
    if (curriculum == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text("Learning Progress"),
        ),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.insights, size: 52, color: Colors.blue.shade600),
                  const SizedBox(height: 12),
                  const Text(
                    "No learning path selected",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Choose a curriculum to track your progress and get recommended next topics.",
                    style: TextStyle(color: Colors.grey.shade700, height: 1.4),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () => context.go("/curriculum"),
                      icon: const Icon(Icons.map),
                      label: const Text("Choose learning path"),
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () => context.go("/course/flutter-ai"),
                      icon: const Icon(Icons.school),
                      label: const Text("Back to Course"),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    final subject = (curriculum!["subject"] ?? "").toString();
    final track = (curriculum!["track"] ?? "").toString();
    final program = (curriculum!["program"] ?? "").toString();

    final percentText = (completion * 100).toStringAsFixed(0);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Learning Progress"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              subject.isEmpty ? "Subject" : subject,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              "Track: ${track.isEmpty ? "N/A" : track} | Program: ${program.isEmpty ? "N/A" : program}",
              style: TextStyle(color: Colors.grey.shade700),
            ),
            const SizedBox(height: 12),

            Text("Completion: $percentText%"),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: completion,
              minHeight: 10,
              backgroundColor: Colors.grey.shade300,
            ),

            const SizedBox(height: 24),

            if (nextTopic != null && nextTopic!.trim().isNotEmpty)
              Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Recommended Next Topic",
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        nextTopic!,
                        style: const TextStyle(fontSize: 16),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () {
                            context.push(
                              "/chat",
                              extra: {
                                "track": track,
                                "program": program,
                                "subject": subject,
                                "topic": nextTopic!,
                              },
                            );
                          },
                          child: const Text("Continue Learning"),
                        ),
                      ),
                      const SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton(
                          onPressed: () {
                            final courseId = _resolveCourseId();
                            context.go('/course/$courseId');
                          },
                          child: const Text("Open Related Course"),
                        ),
                      ),
                    ],
                  ),
                ),
              )
            else
              Card(
                color: Colors.green.shade50,
                child: const Padding(
                  padding: EdgeInsets.all(16),
                  child: Text(
                    "🎉 Congratulations! You have completed this subject.",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}