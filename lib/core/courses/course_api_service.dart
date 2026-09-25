import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import 'course_data.dart';

/// Loads courses from the Azure Functions backend (/api/getCourse) and
/// tracks lesson completion on the device.
class CourseApiService {
  static const String _baseUrl =
      'https://ai-academy-progress-api-bucjc4gtcsenhuhs.swedencentral-01.azurewebsites.net/api';

  static final Map<String, CourseData> _cache = {};

  /// Returns the course, or null if the backend has no course with this id.
  /// Throws on network or server errors so callers can show a retry.
  static Future<CourseData?> getCourse(String courseId) async {
    final cached = _cache[courseId];
    if (cached != null) return cached;

    final response = await http
        .get(Uri.parse(
            '$_baseUrl/getCourse?courseId=${Uri.encodeQueryComponent(courseId)}'))
        .timeout(const Duration(seconds: 20));

    if (response.statusCode == 404) return null;
    if (response.statusCode != 200) {
      throw Exception('Could not load course (HTTP ${response.statusCode}).');
    }

    final course = CourseData.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );
    _cache[courseId] = course;
    return course;
  }

  // ---------------------------------------------------------------------------
  // Lesson completion (stored locally until backend progress sync is wired up)
  // ---------------------------------------------------------------------------

  /// Bumped whenever a lesson is completed so open course pages refresh.
  static final ValueNotifier<int> completionChanges = ValueNotifier(0);

  static String _completionKey(String courseId) =>
      'course_completed_lessons_$courseId';

  static Future<Set<String>> completedLessons(String courseId) async {
    final prefs = await SharedPreferences.getInstance();
    return (prefs.getStringList(_completionKey(courseId)) ?? []).toSet();
  }

  static Future<void> markLessonComplete(
      String courseId, String lessonId) async {
    final prefs = await SharedPreferences.getInstance();
    final completed = await completedLessons(courseId)..add(lessonId);
    await prefs.setStringList(_completionKey(courseId), completed.toList());
    completionChanges.value++;
  }
}
