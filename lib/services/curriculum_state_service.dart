import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class CurriculumStateService {
  static const String _key = "selected_curriculum";

  /// Save the selected curriculum (track/program/subject/topic)
  static Future<void> saveSelection({
    required String track,
    required String program,
    required String subject,
    required String topic,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final payload = {
      "track": track,
      "program": program,
      "subject": subject,
      "topic": topic,
    };
    await prefs.setString(_key, jsonEncode(payload));
  }

  /// Load selection. Returns null if no selection exists.
  static Future<Map<String, dynamic>?> loadSelection() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null || raw.trim().isEmpty) return null;

    try {
      final decoded = jsonDecode(raw);
      if (decoded is Map<String, dynamic>) return decoded;
      if (decoded is Map) return Map<String, dynamic>.from(decoded);
      return null;
    } catch (_) {
      return null;
    }
  }

  /// True if a saved selection exists
  static Future<bool> hasSelection() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    return raw != null && raw.trim().isNotEmpty;
  }

  /// Clear selection
  static Future<void> clearSelection() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}
