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
  final ExerciseScale? scale; // self-assessment exercises

  const LessonExercise({
    required this.id,
    required this.title,
    this.intro = '',
    this.fields = const [],
    this.columns = const [],
    this.rows = const [],
    this.scale,
  });

  bool get isTable => columns.isNotEmpty;
  bool get isScale => scale != null;

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
      scale: json['scale'] is Map<String, dynamic>
          ? ExerciseScale.fromJson(json['scale'])
          : null,
    );
  }
}

/// A scored self-assessment: statements in groups, a 1–N scale and bands.
class ExerciseScale {
  final int min;
  final int max;
  final List<String> labels;
  final List<({String title, List<String> statements})> groups;
  final List<({int min, int max, String title, String text})> bands;

  const ExerciseScale(this.min, this.max, this.labels, this.groups, this.bands);

  List<String> get statements => [for (final g in groups) ...g.statements];

  factory ExerciseScale.fromJson(Map<String, dynamic> json) => ExerciseScale(
        (json['min'] as num?)?.toInt() ?? 1,
        (json['max'] as num?)?.toInt() ?? 5,
        (json['labels'] as List? ?? []).map((l) => l.toString()).toList(),
        (json['groups'] as List? ?? [])
            .whereType<Map<String, dynamic>>()
            .map((g) => (
                  title: g['title'] as String? ?? '',
                  statements: (g['statements'] as List? ?? [])
                      .map((x) => x.toString())
                      .toList(),
                ))
            .toList(),
        (json['bands'] as List? ?? [])
            .whereType<Map<String, dynamic>>()
            .map((b) => (
                  min: (b['min'] as num?)?.toInt() ?? 0,
                  max: (b['max'] as num?)?.toInt() ?? 0,
                  title: b['title'] as String? ?? '',
                  text: b['text'] as String? ?? '',
                ))
            .toList(),
      );
}

/// A single scenario question in a lesson (answer shown after choosing).
class LessonScenario {
  final String id;
  final String title;
  final QuizQuestion question;
  const LessonScenario(this.id, this.title, this.question);

  factory LessonScenario.fromJson(Map<String, dynamic> json) => LessonScenario(
        json['scenarioId'] as String? ?? '',
        json['title'] as String? ?? 'Scenario',
        QuizQuestion.fromJson(json),
      );
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
  final Map<String, QuizResult> scenarios;
  LessonSaved(this.exercises, this.quiz, [Map<String, QuizResult>? scenarios])
      : scenarios = scenarios ?? {};
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
      final sc = (m['scenarios'] as Map<String, dynamic>? ?? {}).map((id, r) =>
          MapEntry(id, QuizResult.fromJson(r as Map<String, dynamic>)));
      out[lessonId] = LessonSaved(
          ex,
          m['quiz'] is Map<String, dynamic>
              ? QuizResult.fromJson(m['quiz'])
              : null,
          sc);
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

  /// Marks the lesson's knowledge check, or one scenario when [quizId] is set.
  static Future<QuizResult> submitQuiz(
      String courseId, String lessonId, List<int> answers,
      {String? quizId}) async {
    final response = await ApiClient.post(
        'submitQuiz',
        jsonEncode({
          'courseId': courseId,
          'lessonId': lessonId,
          'answers': answers,
          if (quizId != null) 'quizId': quizId,
        }));
    if (response.statusCode != 200) {
      throw Exception(_error(response.body, 'Could not mark your answers.'));
    }
    final result =
        QuizResult.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    final lesson =
        (_cache[courseId] ??= {})[lessonId] ??= LessonSaved({}, null);
    if (quizId == null) {
      lesson.quiz = result;
    } else {
      lesson.scenarios[quizId] = result;
    }
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
