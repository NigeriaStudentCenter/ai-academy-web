import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:go_router/go_router.dart';

import '../../core/courses/course_api_service.dart';
import '../../core/courses/course_data.dart';

class LessonPlayerPage extends StatefulWidget {
  final String courseId;
  final String lessonId;

  const LessonPlayerPage({
    super.key,
    required this.courseId,
    required this.lessonId,
  });

  @override
  State<LessonPlayerPage> createState() => _LessonPlayerPageState();
}

class _LessonPlayerPageState extends State<LessonPlayerPage> {
  CourseData? course;
  bool completed = false;
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void didUpdateWidget(LessonPlayerPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.lessonId != widget.lessonId ||
        oldWidget.courseId != widget.courseId) {
      _load();
    }
  }

  Future<void> _load() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final loaded = await CourseApiService.getCourse(widget.courseId);
      final done = await CourseApiService.completedLessons(widget.courseId);
      if (!mounted) return;
      setState(() {
        course = loaded;
        completed = done.contains(widget.lessonId);
        loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  Future<void> _markComplete() async {
    await CourseApiService.markLessonComplete(
        widget.courseId, widget.lessonId);
    if (!mounted) return;
    setState(() => completed = true);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Lesson marked as complete')),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final lesson = course?.lessonById(widget.lessonId);

    if (error != null || lesson == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Lesson')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  error != null
                      ? 'We could not load this lesson. Check your connection and try again.'
                      : 'This lesson could not be found.',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 16),
                if (error != null)
                  ElevatedButton(onPressed: _load, child: const Text('Retry')),
                TextButton(
                  onPressed: () => context.go('/course/${widget.courseId}'),
                  child: const Text('Back to course'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final next = course!.nextLesson(lesson.lessonId);

    return Scaffold(
      appBar: AppBar(
        title: Text(course!.title),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/course/${widget.courseId}'),
        ),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 760),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Text(
                'Lesson ${lesson.lessonOrder} of ${course!.lessons.length}'
                '${lesson.duration.isNotEmpty ? ' • ${lesson.duration}' : ''}',
                style: TextStyle(color: Colors.grey.shade600),
              ),
              if (lesson.objective.isNotEmpty) ...[
                const SizedBox(height: 12),
                Card(
                  color: Colors.blue.shade50,
                  child: ListTile(
                    leading: const Icon(Icons.flag, color: Colors.blue),
                    title: const Text('Goal',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(lesson.objective),
                  ),
                ),
              ],
              const SizedBox(height: 8),
              HtmlWidget(
                lesson.contentBody,
                textStyle: const TextStyle(fontSize: 16, height: 1.5),
              ),
              if (lesson.reflectionQuestion.isNotEmpty) ...[
                const SizedBox(height: 16),
                Card(
                  color: Colors.amber.shade50,
                  child: ListTile(
                    leading: const Icon(Icons.psychology, color: Colors.amber),
                    title: const Text('Think about it',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(lesson.reflectionQuestion),
                    trailing: IconButton(
                      tooltip: 'Discuss with the AI Tutor',
                      icon: const Icon(Icons.chat),
                      onPressed: () => context.push('/chat'),
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 24),
              if (completed)
                const ListTile(
                  leading: Icon(Icons.check_circle, color: Colors.green),
                  title: Text('You have completed this lesson'),
                )
              else
                ElevatedButton.icon(
                  onPressed: _markComplete,
                  icon: const Icon(Icons.check),
                  label: const Text('Mark lesson complete'),
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 50),
                  ),
                ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: () => context.go(next != null
                    ? '/course/${widget.courseId}/lesson/${next.lessonId}'
                    : '/course/${widget.courseId}'),
                icon: Icon(next != null ? Icons.arrow_forward : Icons.list),
                label: Text(next != null
                    ? 'Next: ${next.title}'
                    : 'Back to course overview'),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
