import 'dart:convert';

import 'package:flutter/foundation.dart';

import '../api/api_client.dart';
import 'course_data.dart';

/// Courses and lesson progress from the AI Academy backend. The backend only
/// returns courses the signed-in learner's audience (teens / professional)
/// allows, and records progress against their Microsoft account.
class CourseApiService {
  static final Map<String, CourseData> _courseCache = {};
  static final Map<String, Set<String>> _progressCache = {};

  /// Bumped whenever a lesson is completed so open course pages refresh.
  static final ValueNotifier<int> completionChanges = ValueNotifier(0);

  /// Courses this learner can take.
  static Future<List<CourseSummary>> listCourses() async =>
      (await listCatalog()).courses;

  /// Courses this learner can take, with their categories in display order.
  static Future<
          ({List<CourseSummary> courses, List<CourseCategory> categories})>
      listCatalog() async {
    final response = await ApiClient.get('listCourses');
    if (response.statusCode != 200) {
      throw Exception('Could not load courses (HTTP ${response.statusCode}).');
    }
    final json = jsonDecode(response.body) as Map<String, dynamic>;
    return (
      courses: (json['courses'] as List? ?? [])
          .whereType<Map<String, dynamic>>()
          .map(CourseSummary.fromJson)
          .toList(),
      categories: (json['categories'] as List? ?? [])
          .whereType<Map<String, dynamic>>()
          .map(CourseCategory.fromJson)
          .toList(),
    );
  }

  /// Returns the course, or null if it doesn't exist or isn't available to
  /// this learner. Throws on network or server errors so callers can retry.
  static Future<CourseData?> getCourse(String courseId) async {
    final cached = _courseCache[courseId];
    if (cached != null) return cached;

    final response = await ApiClient.get('getCourse', {'courseId': courseId});
    if (response.statusCode == 404) return null;
    if (response.statusCode != 200) {
      throw Exception('Could not load course (HTTP ${response.statusCode}).');
    }

    final course = CourseData.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );
    _courseCache[courseId] = course;
    return course;
  }

  /// Lesson ids this learner has completed in [courseId].
  static Future<Set<String>> completedLessons(String courseId) async {
    final cached = _progressCache[courseId];
    if (cached != null) return cached;

    final response = await ApiClient.get('getProgress');
    if (response.statusCode != 200) {
      throw Exception('Could not load progress (HTTP ${response.statusCode}).');
    }
    for (final row in (jsonDecode(response.body) as List)
        .whereType<Map<String, dynamic>>()) {
      _progressCache[row['courseId'] as String] =
          ((row['completedLessons'] as List?) ?? []).cast<String>().toSet();
    }
    return _progressCache[courseId] ??= {};
  }

  /// Records a completed lesson. Returns a certificate id when this finished
  /// a certificate-eligible course.
  static Future<String?> markLessonComplete(
      String courseId, String lessonId) async {
    final response = await ApiClient.post(
      'saveProgress',
      jsonEncode({'courseId': courseId, 'lessonId': lessonId}),
    );
    if (response.statusCode != 200) {
      throw Exception('Could not save progress (HTTP ${response.statusCode}).');
    }
    final json = jsonDecode(response.body) as Map<String, dynamic>;
    _progressCache[courseId] =
        ((json['completedLessons'] as List?) ?? []).cast<String>().toSet();
    completionChanges.value++;
    return json['certificateId'] as String?;
  }

  /// Forget cached data (e.g. after signing out).
  static void clearCache() {
    _courseCache.clear();
    _progressCache.clear();
  }
}
