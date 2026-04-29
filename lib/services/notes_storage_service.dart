import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class NotesStorageService {
  static const String _cacheKey = "ai_notes_cache_v1";

  /// Save notes for a topic + mode.
  static Future<void> saveNotes({
    required String topic,
    required String mode,
    required String notes,
  }) async {
    final prefs = await SharedPreferences.getInstance();

    final Map<String, dynamic> cache = await _loadCache(prefs);

    cache[topic] = {
      "mode": mode,
      "notes": notes,
      "updatedAt": DateTime.now().toIso8601String(),
    };

    await prefs.setString(_cacheKey, jsonEncode(cache));
  }

  /// Load saved notes for a topic. Returns null if none saved.
  static Future<Map<String, dynamic>?> loadNotes(String topic) async {
    final prefs = await SharedPreferences.getInstance();
    final Map<String, dynamic> cache = await _loadCache(prefs);

    final item = cache[topic];
    if (item is Map<String, dynamic>) return item;
    if (item is Map) return Map<String, dynamic>.from(item);

    return null;
  }

  /// Remove saved notes for a topic.
  static Future<void> deleteNotes(String topic) async {
    final prefs = await SharedPreferences.getInstance();
    final Map<String, dynamic> cache = await _loadCache(prefs);
    cache.remove(topic);
    await prefs.setString(_cacheKey, jsonEncode(cache));
  }

  /// Clear all saved notes.
  static Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_cacheKey);
  }

  static Future<Map<String, dynamic>> _loadCache(SharedPreferences prefs) async {
    final raw = prefs.getString(_cacheKey);
    if (raw == null || raw.trim().isEmpty) return <String, dynamic>{};

    try {
      final decoded = jsonDecode(raw);
      if (decoded is Map<String, dynamic>) return decoded;
      if (decoded is Map) return Map<String, dynamic>.from(decoded);
      return <String, dynamic>{};
    } catch (_) {
      // If corrupted, start fresh
      return <String, dynamic>{};
    }
  }
}