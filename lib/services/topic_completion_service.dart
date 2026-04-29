import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class TopicCompletionService {
  static const String _key = "completed_topics";

  /// Returns a Set of completed topic identifiers
  static Future<Set<String>> getCompletedTopics() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null) return {};

    try {
      final decoded = jsonDecode(raw);
      if (decoded is List) {
        return decoded.map((e) => e.toString()).toSet();
      }
    } catch (_) {}

    return {};
  }

  /// Check if a topic is explicitly completed
  static Future<bool> isCompleted({
    required String track,
    required String program,
    required String subject,
    required String topic,
  }) async {
    final completed = await getCompletedTopics();
    final id = _topicId(track, program, subject, topic);
    return completed.contains(id);
  }

  /// Mark a topic as completed
  static Future<void> markCompleted({
    required String track,
    required String program,
    required String subject,
    required String topic,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final completed = await getCompletedTopics();

    final id = _topicId(track, program, subject, topic);
    completed.add(id);

    await prefs.setString(_key, jsonEncode(completed.toList()));
  }

  static String _topicId(
    String track,
    String program,
    String subject,
    String topic,
  ) {
    return "$track|$program|$subject|$topic";
  }
}