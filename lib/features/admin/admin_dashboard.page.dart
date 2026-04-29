import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../services/curriculum_state_service.dart';
import '../../services/curriculum_registry.dart';
import '../../services/progress_service.dart';
import '../../services/topic_completion_service.dart';

class AdminDashboardPage extends StatefulWidget {
  const AdminDashboardPage({super.key});

  @override
  State<AdminDashboardPage> createState() =>
      _AdminDashboardPageState();
}

class _AdminDashboardPageState
    extends State<AdminDashboardPage> {
  Map<String, dynamic>? curriculum;
  List<String> topics = [];
  Set<String> completedTopics = {};
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final saved =
        await CurriculumStateService.loadSelection();
    if (!mounted) return;

    if (saved == null) {
      setState(() {
        curriculum = null;
        loading = false;
      });
      return;
    }

    final track = saved["track"];
    final program = saved["program"];
    final subject = saved["subject"];

    final registry = CurriculumRegistry.registry;
    final subjectTopics = List<String>.from(
      registry[track][program]["subjects"][subject],
    );

    final Set<String> completed = {};

    for (final topic in subjectTopics) {
      // Explicit completion takes priority
      final explicitlyCompleted =
          await TopicCompletionService.isCompleted(
        track: track,
        program: program,
        subject: subject,
        topic: topic,
      );

      if (explicitlyCompleted) {
        completed.add(topic);
        continue;
      }

      // Fallback: mastery signal
      final masteryRaw =
          await ProgressService.getMasteryLevel(topic);
      final mastery =
          double.tryParse(masteryRaw.toString()) ?? 0.0;

      if (mastery >= 0.8) {
        completed.add(topic);
      }
    }

    setState(() {
      curriculum = saved;
      topics = subjectTopics;
      completedTopics = completed;
      loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (curriculum == null) {
      return Scaffold(
        appBar: AppBar(title: const Text("Admin Dashboard")),
        body: const Center(
          child: Text("No curriculum selected."),
        ),
      );
    }

    final track = curriculum!["track"];
    final program = curriculum!["program"];
    final subject = curriculum!["subject"];

    final total = topics.length;
    final completed = completedTopics.length;
    final percent =
        total == 0 ? 0 : ((completed / total) * 100).round();

    return Scaffold(
      appBar: AppBar(
        title: const Text("Admin Dashboard"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ✅ Context
            const Text(
              "Current Curriculum",
              style:
                  TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text("Track: $track"),
            Text("Program: $program"),
            Text("Subject: $subject"),

            const SizedBox(height: 16),

            // ✅ Overall progress
            Text(
              "Overall Completion: $percent%",
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: total == 0 ? 0 : completed / total,
            ),

            const SizedBox(height: 24),

            // ✅ Topic list
            const Text(
              "Topic Status",
              style:
                  TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            Expanded(
              child: ListView.builder(
                itemCount: topics.length,
                itemBuilder: (context, index) {
                  final topic = topics[index];
                  final isCompleted =
                      completedTopics.contains(topic);

                  return ListTile(
                    leading: Icon(
                      isCompleted
                          ? Icons.check_circle
                          : Icons.radio_button_unchecked,
                      color:
                          isCompleted ? Colors.green : null,
                    ),
                    title: Text(topic),
                    subtitle: Text(
                      isCompleted
                          ? "Completed"
                          : "Not completed",
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}