import 'dart:convert';

import '../api/api_client.dart';

/// One curriculum (Nigerian NERDC or British UK National) from the backend.
class Curriculum {
  final String id;
  final String label;
  final String primaryHint;
  final String secondaryHint;
  final Map<String, List<String>> years; // Primary / Secondary → classes
  final Map<String, List<String>> subjects;

  const Curriculum({
    required this.id,
    required this.label,
    required this.primaryHint,
    required this.secondaryHint,
    required this.years,
    required this.subjects,
  });

  static Map<String, List<String>> _lists(dynamic json) =>
      (json as Map<String, dynamic>? ?? {}).map((k, v) =>
          MapEntry(k, (v as List).map((e) => e.toString()).toList()));

  factory Curriculum.fromJson(String id, Map<String, dynamic> json) => Curriculum(
        id: id,
        label: json['label'] as String? ?? id,
        primaryHint: json['primHint'] as String? ?? '',
        secondaryHint: json['secHint'] as String? ?? '',
        years: _lists(json['years']),
        subjects: _lists(json['subjects']),
      );
}

/// The learner's locked learning path.
class LearningPath {
  final String curriculum;
  final String level;
  final String year;
  final String subject;
  final String topic;

  const LearningPath({
    required this.curriculum,
    required this.level,
    required this.year,
    required this.subject,
    this.topic = '',
  });

  Map<String, String> toJson() => {
        'curriculum': curriculum,
        'level': level,
        'year': year,
        'subject': subject,
        'topic': topic,
      };
}

class TutorTurn {
  final String role; // 'user' | 'assistant'
  final String content;
  const TutorTurn(this.role, this.content);

  Map<String, String> toJson() => {'role': role, 'content': content};
}

/// AI Tutor Command Center (AI Academy for Teens) — /api/tutorSession.
class CommandCenterService {
  static const _timeout = Duration(seconds: 60);
  static List<Curriculum>? _curricula;

  static String _error(String body, String fallback) {
    try {
      return (jsonDecode(body) as Map<String, dynamic>)['error'] as String? ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  static Future<List<Curriculum>> curricula() async {
    if (_curricula != null) return _curricula!;
    final response = await ApiClient.get('tutorSession');
    if (response.statusCode != 200) {
      throw Exception(_error(response.body, 'Could not load the curricula.'));
    }
    final data = (jsonDecode(response.body) as Map<String, dynamic>)['curricula']
        as Map<String, dynamic>;
    // Nigerian first, then British — as on the Teens Academy site.
    _curricula = ['ng', 'uk']
        .where(data.containsKey)
        .map((id) => Curriculum.fromJson(id, data[id] as Map<String, dynamic>))
        .toList();
    return _curricula!;
  }

  static Future<List<String>> suggestTopics(LearningPath path) async {
    final response = await ApiClient.post(
        'tutorSession', jsonEncode({'path': path.toJson(), 'suggest': true}),
        timeout: _timeout);
    if (response.statusCode != 200) return [];
    final topics = (jsonDecode(response.body) as Map<String, dynamic>)['topics'];
    return (topics as List? ?? []).map((t) => t.toString()).toList();
  }

  /// The tutor's next message. [turns] excludes the hidden opening prompt,
  /// which the backend adds.
  static Future<String> nextMessage(LearningPath path, List<TutorTurn> turns) async {
    final response = await ApiClient.post(
        'tutorSession',
        jsonEncode({
          'path': path.toJson(),
          'turns': turns.map((t) => t.toJson()).toList(),
        }),
        timeout: _timeout);
    if (response.statusCode != 200) {
      throw Exception(_error(response.body, 'The tutor is unavailable. Please try again.'));
    }
    return (jsonDecode(response.body) as Map<String, dynamic>)['text'] as String? ?? '';
  }
}
