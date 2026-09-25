import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/courses/course_data.dart';
import '../../../widgets/app_nav_drawer.dart';

/// Course overview for courses served by the backend (/api/getCourse).
class BackendCourseView extends StatelessWidget {
  final CourseData course;
  final Set<String> completedLessons;

  const BackendCourseView({
    super.key,
    required this.course,
    required this.completedLessons,
  });

  @override
  Widget build(BuildContext context) {
    final lessons = course.lessons;
    final doneCount =
        lessons.where((l) => completedLessons.contains(l.lessonId)).length;
    final allDone = lessons.isNotEmpty && doneCount == lessons.length;

    LessonData? nextLesson;
    for (final lesson in lessons) {
      if (!completedLessons.contains(lesson.lessonId)) {
        nextLesson = lesson;
        break;
      }
    }

    return Scaffold(
      drawer: const AppNavDrawer(),
      appBar: AppBar(
        title: Text(course.title),
        actions: [
          IconButton(
            tooltip: 'AI Tutor',
            icon: const Icon(Icons.chat),
            onPressed: () => context.push('/chat'),
          ),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 760),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Text(
                course.title,
                style:
                    const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text(
                [course.level, course.estimatedDuration, '${lessons.length} lessons']
                    .where((s) => s.isNotEmpty)
                    .join(' • '),
                style: TextStyle(color: Colors.grey.shade600),
              ),
              if (course.description.isNotEmpty) ...[
                const SizedBox(height: 12),
                Text(course.description, style: const TextStyle(fontSize: 16)),
              ],
              const SizedBox(height: 16),
              LinearProgressIndicator(
                value: lessons.isEmpty ? 0 : doneCount / lessons.length,
                minHeight: 8,
                borderRadius: BorderRadius.circular(4),
              ),
              const SizedBox(height: 6),
              Text('$doneCount of ${lessons.length} lessons completed'),
              const SizedBox(height: 16),
              if (nextLesson != null)
                Card(
                  color: Colors.blue.shade50,
                  child: ListTile(
                    leading:
                        const Icon(Icons.play_circle_fill, color: Colors.blue),
                    title: Text(
                      doneCount == 0 ? 'Start learning' : 'Resume learning',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(nextLesson.title),
                    trailing: const Icon(Icons.arrow_forward),
                    onTap: () => context.go(
                        '/course/${course.courseId}/lesson/${nextLesson!.lessonId}'),
                  ),
                ),
              if (allDone)
                Card(
                  color: Colors.green.shade50,
                  child: const ListTile(
                    leading: Icon(Icons.verified, color: Colors.green),
                    title: Text('Course completed',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('Well done — you finished every lesson.'),
                  ),
                ),
              const SizedBox(height: 8),
              for (final lesson in lessons)
                Card(
                  margin: const EdgeInsets.symmetric(vertical: 6),
                  child: ListTile(
                    leading: completedLessons.contains(lesson.lessonId)
                        ? const Icon(Icons.check_circle, color: Colors.green)
                        : lesson == nextLesson
                            ? const Icon(Icons.play_circle_fill,
                                color: Colors.blue)
                            : const Icon(Icons.radio_button_unchecked,
                                color: Colors.grey),
                    title: Text('${lesson.lessonOrder}. ${lesson.title}'),
                    subtitle:
                        lesson.duration.isNotEmpty ? Text(lesson.duration) : null,
                    onTap: () => context.go(
                        '/course/${course.courseId}/lesson/${lesson.lessonId}'),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
