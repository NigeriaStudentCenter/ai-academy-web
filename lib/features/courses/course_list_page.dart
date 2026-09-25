import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/courses/course_api_service.dart';
import '../../core/courses/course_data.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/app_nav_drawer.dart';

/// Courses the signed-in learner can take (filtered by the backend by
/// audience: teenskills.co.uk → Teens, everyone else → Professional).
class CourseListPage extends StatefulWidget {
  const CourseListPage({super.key});

  @override
  State<CourseListPage> createState() => _CourseListPageState();
}

class _CourseListPageState extends State<CourseListPage> {
  late Future<List<CourseSummary>> _courses;

  @override
  void initState() {
    super.initState();
    _courses = CourseApiService.listCourses();
  }

  void _retry() => setState(() => _courses = CourseApiService.listCourses());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkGreen,
      drawer: const AppNavDrawer(),
      appBar: AppBar(
        backgroundColor: AppColors.darkGreen,
        foregroundColor: AppColors.nearWhite,
        elevation: 0,
        title: const Text(
          "My Courses",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
        ),
      ),
      body: FutureBuilder<List<CourseSummary>>(
        future: _courses,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.nearWhite),
            );
          }

          if (snapshot.hasError) {
            return _Message(
              text: 'We could not load your courses. Check your connection and try again.',
              action: TextButton(
                onPressed: _retry,
                child: const Text('Retry',
                    style: TextStyle(color: AppColors.nearWhite)),
              ),
            );
          }

          final courses = snapshot.data!;
          if (courses.isEmpty) {
            return const _Message(
              text: 'No courses have been assigned to your account yet.',
            );
          }

          return Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 760),
              child: ListView.separated(
                padding: const EdgeInsets.all(20),
                itemCount: courses.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final course = courses[index];
                  return Card(
                    color: AppColors.nearWhite,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(16),
                      leading: const Icon(Icons.school,
                          color: AppColors.darkGreen, size: 36),
                      title: Text(
                        course.title,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            color: AppColors.darkGreen),
                      ),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(top: 6),
                        child: Text(
                          [
                            course.description,
                            [
                              course.level,
                              course.estimatedDuration,
                              '${course.lessonCount} lessons'
                            ].where((s) => s.isNotEmpty).join(' • '),
                          ].where((s) => s.isNotEmpty).join('\n'),
                        ),
                      ),
                      trailing: const Icon(Icons.arrow_forward,
                          color: AppColors.darkGreen),
                      onTap: () => context.go('/course/${course.courseId}'),
                    ),
                  );
                },
              ),
            ),
          );
        },
      ),
    );
  }
}

class _Message extends StatelessWidget {
  final String text;
  final Widget? action;

  const _Message({required this.text, this.action});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              text,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.nearWhite, fontSize: 16),
            ),
            if (action != null) ...[const SizedBox(height: 12), action!],
          ],
        ),
      ),
    );
  }
}
