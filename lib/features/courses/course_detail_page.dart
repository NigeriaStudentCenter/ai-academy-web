import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../widgets/app_nav_drawer.dart';
import '../../services/curriculum_state_service.dart';
import '../../services/curriculum_registry.dart';
import '../../services/curriculum_progress_service.dart';
import '../../services/progress_service.dart';

class CourseDetailPage extends StatefulWidget {
  final String courseId;

  const CourseDetailPage({
    super.key,
    required this.courseId,
  });

  @override
  State<CourseDetailPage> createState() => _CourseDetailPageState();
}

class _CourseDetailPageState extends State<CourseDetailPage> {
  Map<String, dynamic>? curriculum;
  List<String> topics = [];
  String? nextTopic;
  Set<String> completedTopics = {};
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadCourse();
  }

  Future<void> _loadCourse() async {
    final saved = await CurriculumStateService.loadSelection();
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

    final recommended = await CurriculumProgressService.nextTopic(
      track: track,
      program: program,
      subject: subject,
    );

    final Set<String> completed = {};
    for (final topic in subjectTopics) {
      final masteryRaw = await ProgressService.getMasteryLevel(topic);
      final mastery = double.tryParse(masteryRaw.toString()) ?? 0.0;

      if (mastery >= 0.8) {
        completed.add(topic);
      }
    }

    setState(() {
      curriculum = saved;
      topics = subjectTopics;
      nextTopic = recommended;
      completedTopics = completed;
      loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!loading && curriculum == null) {
      return Scaffold(
        drawer: const AppNavDrawer(),
        appBar: AppBar(title: const Text("Course")),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                "No learning path selected yet",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                "Choose a learning path to begin.",
                style: TextStyle(color: Colors.black54),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => context.go("/curriculum"),
                child: const Text("Choose Learning Path"),
              ),
            ],
          ),
        ),
      );
    }

    if (loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final track = curriculum!["track"];
    final program = curriculum!["program"];
    final subject = curriculum!["subject"];

    final bool subjectCompleted =
        topics.isNotEmpty && completedTopics.length == topics.length;

    return Scaffold(
      drawer: const AppNavDrawer(),
      appBar: AppBar(
        title: Text(subject),
        actions: [
          IconButton(
            tooltip: "AI Notes",
            icon: const Icon(Icons.lightbulb),
            onPressed: () {
              context.push("/notes");
            },
          ),
          IconButton(
            tooltip: "AI Tutor",
            icon: const Icon(Icons.chat),
            onPressed: () {
              context.push("/chat");
            },
          ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  subject,
                  style:
                      const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  "$track • $program",
                  style: TextStyle(color: Colors.grey.shade600),
                ),
              ],
            ),
          ),

          // Resume banner
          if (nextTopic != null && !subjectCompleted)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Card(
                color: Colors.blue.shade50,
                child: ListTile(
                  leading: const Icon(Icons.play_circle_fill, color: Colors.blue),
                  title: const Text(
                    "Resume learning",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text('Continue with "$nextTopic"'),
                  trailing: const Icon(Icons.arrow_forward),
                  onTap: () {
                    context.go(
                      "/course/${widget.courseId}/lesson/$nextTopic",
                    );
                  },
                ),
              ),
            ),

          if (subjectCompleted)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Card(
                color: Colors.green.shade50,
                child: ListTile(
                  leading:
                      const Icon(Icons.verified, color: Colors.green),
                  title: const Text(
                    "Subject completed",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: const Text("View your completion certificate"),
                  onTap: () => context.push("/certificate"),
                ),
              ),
            ),

          const Divider(height: 1),

          // Topic list
          Expanded(
            child: ListView.builder(
              itemCount: topics.length,
              itemBuilder: (context, index) {
                final topic = topics[index];
                final isCompleted = completedTopics.contains(topic);
                final isNext = topic == nextTopic;

                IconData icon;
                Color color;

                if (isCompleted) {
                  icon = Icons.check_circle;
                  color = Colors.green;
                } else if (isNext) {
                  icon = Icons.play_circle_fill;
                  color = Colors.blue;
                } else {
                  icon = Icons.radio_button_unchecked;
                  color = Colors.grey;
                }

                return Card(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: ListTile(
                    leading: Icon(icon, color: color),
                    title: Text(topic),
                    onTap: () {
                      context.go(
                        "/course/${widget.courseId}/lesson/$topic",
                      );
                    },
                  ),
                );
              },
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton.icon(
              onPressed: () => context.go("/progress"),
              icon: const Icon(Icons.insights),
              label: const Text("View Progress Dashboard"),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
              ),
            ),
          ),
        ],
      ),
    );
  }
}