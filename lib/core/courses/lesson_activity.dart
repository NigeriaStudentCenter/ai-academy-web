import 'dart:convert';

import '../api/api_client.dart';

/// An exercise learners complete inside a lesson: named fields, or a table.
class LessonExercise {
  final String id;
  final String title;
  final String intro;
  final List<ExerciseField> fields;
  final List<String> columns; // table exercises
  final List<String> rows;

  const LessonExercise({
    required this.id,
    required this.title,
    this.intro = '',
    this.fields = const [],
    this.columns = const [],
    this.rows = const [],
  });

  bool get isTable => columns.isNotEmpty;

  factory LessonExercise.fromJson(Map<String, dynamic> json) {
    final table = json['table'] as Map<String, dynamic>?;
    return LessonExercise(
      id: json['exerciseId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      intro: json['intro'] as String? ?? '',
      fields: (json['fields'] as List? ?? [])
          .whereType<Map<String, dynamic>>()
          .map(ExerciseField.fromJson)
          .toList(),
      columns:
          (table?['columns'] as List? ?? []).map((c) => c.toString()).toList(),
      rows: (table?['rows'] as List? ?? []).map((r) => r.toString()).toList(),
    );
  }
}

class ExerciseField {
  final String id;
  final String label;
  final bool multiline;
  final int minWords;
  final int maxWords;

  const ExerciseField({
    required this.id,
    required this.label,
    this.multiline = true,
    this.minWords = 0,
    this.maxWords = 0,
  });

  factory ExerciseField.fromJson(Map<String, dynamic> json) => ExerciseField(
        id: json['id'] as String? ?? '',
        label: json['label'] as String? ?? '',
        multiline: (json['type'] as String? ?? 'textarea') != 'text',
        minWords: (json['minWords'] as num?)?.toInt() ?? 0,
        maxWords: (json['maxWords'] as num?)?.toInt() ?? 0,
      );
}

/// The in-lesson AI thinking partner for an AI practical exercise.
class LessonCoach {
  final String id;
  final String title;
  final String intro;
  final String promptTemplate;
  final bool usesAnswers;

  const LessonCoach({
    required this.id,
    required this.title,
    this.intro = '',
    this.promptTemplate = '',
    this.usesAnswers = false,
  });

  factory LessonCoach.fromJson(Map<String, dynamic> json) => LessonCoach(
        id: json['coachId'] as String? ?? '',
        title: json['title'] as String? ?? 'AI Thinking Partner',
        intro: json['intro'] as String? ?? '',
        promptTemplate: json['promptTemplate'] as String? ?? '',
        usesAnswers: (json['usesExercises'] as List? ?? []).isNotEmpty,
      );
}

class QuizQuestion {
  final String question;
  final List<String> options;
  const QuizQuestion(this.question, this.options);

  factory QuizQuestion.fromJson(Map<String, dynamic> json) => QuizQuestion(
        json['question'] as String? ?? '',
        (json['options'] as List? ?? []).map((o) => o.toString()).toList(),
      );
}

class QuizResult {
  final int score;
  final int total;
  final List<({int? chosen, bool correct, int answer, String explanation})>
      results;

  const QuizResult(this.score, this.total, this.results);

  factory QuizResult.fromJson(Map<String, dynamic> json) => QuizResult(
        (json['score'] as num?)?.toInt() ?? 0,
        (json['total'] as num?)?.toInt() ?? 0,
        (json['results'] as List? ?? [])
            .whereType<Map<String, dynamic>>()
            .map((r) => (
                  chosen: (r['chosen'] as num?)?.toInt(),
                  correct: r['correct'] as bool? ?? false,
                  answer: (r['answer'] as num?)?.toInt() ?? 0,
                  explanation: r['explanation'] as String? ?? '',
                ))
            .toList(),
      );
}

/// A Module's submission item (shown in the portfolio block).
class PortfolioItem {
  final String exerciseId;
  final String lessonId;
  final String title;
  const PortfolioItem(this.exerciseId, this.lessonId, this.title);

  factory PortfolioItem.fromJson(Map<String, dynamic> json) => PortfolioItem(
        json['exerciseId'] as String? ?? '',
        json['lessonId'] as String? ?? '',
        json['title'] as String? ?? '',
      );
}

/// What a learner has saved in one lesson.
class LessonSaved {
  final Map<String, Map<String, String>> exercises;
  QuizResult? quiz;
  LessonSaved(this.exercises, this.quiz);
}

/// Saved answers, knowledge checks and the AI thinking partner —
/// /api/lessonResponses, /api/submitQuiz, /api/lessonCoach.
class LessonActivityService {
  static final Map<String, Map<String, LessonSaved>> _cache = {};

  static String _error(String body, String fallback) {
    try {
      return (jsonDecode(body) as Map<String, dynamic>)['error'] as String? ??
          fallback;
    } catch (_) {
      return fallback;
    }
  }

  /// Everything the learner saved in a course, by lesson.
  static Future<Map<String, LessonSaved>> load(String courseId,
      {bool refresh = false}) async {
    if (!refresh && _cache.containsKey(courseId)) return _cache[courseId]!;
    final response =
        await ApiClient.get('lessonResponses', {'courseId': courseId});
    if (response.statusCode != 200) {
      throw Exception(_error(response.body, 'Could not load your saved work.'));
    }
    final data = (jsonDecode(response.body)
            as Map<String, dynamic>)['responses'] as Map<String, dynamic>? ??
        {};
    final out = <String, LessonSaved>{};
    data.forEach((lessonId, v) {
      final m = v as Map<String, dynamic>;
      final ex = (m['exercises'] as Map<String, dynamic>? ?? {}).map(
          (id, vals) => MapEntry(
              id,
              (vals as Map<String, dynamic>)
                  .map((k, x) => MapEntry(k, x.toString()))));
      out[lessonId] = LessonSaved(
          ex,
          m['quiz'] is Map<String, dynamic>
              ? QuizResult.fromJson(m['quiz'])
              : null);
    });
    return _cache[courseId] = out;
  }

  static Future<void> saveExercise(String courseId, String lessonId,
      String exerciseId, Map<String, String> values) async {
    final response = await ApiClient.post(
        'lessonResponses',
        jsonEncode({
          'courseId': courseId,
          'lessonId': lessonId,
          'exerciseId': exerciseId,
          'values': values
        }));
    if (response.statusCode != 200) {
      throw Exception(_error(response.body, 'Could not save your answers.'));
    }
    final lesson =
        (_cache[courseId] ??= {})[lessonId] ??= LessonSaved({}, null);
    lesson.exercises[exerciseId] = Map.of(values);
  }

  static Future<QuizResult> submitQuiz(
      String courseId, String lessonId, List<int> answers) async {
    final response = await ApiClient.post(
        'submitQuiz',
        jsonEncode(
            {'courseId': courseId, 'lessonId': lessonId, 'answers': answers}));
    if (response.statusCode != 200) {
      throw Exception(_error(response.body, 'Could not mark your answers.'));
    }
    final result =
        QuizResult.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    final lesson =
        (_cache[courseId] ??= {})[lessonId] ??= LessonSaved({}, null);
    lesson.quiz = result;
    return result;
  }

  /// The learner's saved answers the coach uses, as text.
  static Future<String> coachAnswers(
      String courseId, String lessonId, String coachId) async {
    final response = await ApiClient.get('lessonCoach',
        {'courseId': courseId, 'lessonId': lessonId, 'coachId': coachId});
    if (response.statusCode != 200) return '';
    return (jsonDecode(response.body) as Map<String, dynamic>)['answers']
            as String? ??
        '';
  }

  static Future<String> coachReply(String courseId, String lessonId,
      String coachId, List<({String role, String content})> turns) async {
    final response = await ApiClient.post(
        'lessonCoach',
        jsonEncode({
          'courseId': courseId,
          'lessonId': lessonId,
          'coachId': coachId,
          'turns': [
            for (final t in turns) {'role': t.role, 'content': t.content}
          ],
        }),
        timeout: const Duration(seconds: 90));
    if (response.statusCode != 200) {
      throw Exception(_error(response.body,
          'Your thinking partner is unavailable. Please try again.'));
    }
    return (jsonDecode(response.body) as Map<String, dynamic>)['text']
            as String? ??
        '';
  }
}
