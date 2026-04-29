import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class ProgressService {
  static const String _key = 'learning_progress';

  static Future<Map<String, dynamic>> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null) return {};
    return jsonDecode(raw);
  }

  static Future<void> _save(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(data));
  }

  static Future<void> recordAttempt(
    String topic, {
    required bool correct,
  }) async {
    final data = await _load();

    data[topic] ??= {
      "attempts": 0,
      "correct": 0,
    };

    data[topic]["attempts"] += 1;
    if (correct) {
      data[topic]["correct"] += 1;
    }

    await _save(data);
  }

  static Future<String> getMasteryLevel(String topic) async {
    final data = await _load();
    final record = data[topic];

    if (record == null) return 'new';

    final attempts = record["attempts"];
    final correct = record["correct"];

    if (attempts == 0) return 'new';

    final accuracy = correct / attempts;
    if (accuracy < 0.4) return 'weak';
    if (accuracy < 0.7) return 'improving';
    return 'strong';
  }

  static Future<Map<String, dynamic>> getAllProgress() async {
    return await _load();
  }

  /// ✅ CLEAR ALL PROGRESS (Change Learning Path)
  static Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}