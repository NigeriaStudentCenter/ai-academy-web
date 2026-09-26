import 'lesson_activity.dart';

/// Course and lesson models matching the /api/getCourse JSON shape.
class LessonData {
  final String lessonId;
  final String title;
  final int lessonOrder;
  final String duration;
  final String objective;
  final String contentBody;
  final String completionType;
  final String videoAssetId;
  final String reflectionQuestion;
  final bool published;

  /// Signed, expiring URL for the lesson video (SharePoint courses).
  final String videoUrl;

  /// External assessment (e.g. Microsoft Forms) for the lesson.
  final String assessmentUrl;

  /// Where the lesson is studied or continued outside the app (e.g. a
  /// Microsoft AI Skills Navigator playlist), with its button label.
  final String resourceUrl;
  final String resourceLabel;

  /// Downloads for the lesson (workbooks, slides, handouts) with signed URLs.
  final List<LessonAttachment> attachments;

  /// Interactive parts (built-in courses): exercises, AI thinking partners,
  /// knowledge check and the module portfolio.
  final List<LessonExercise> exercises;
  final List<LessonCoach> coaches;
  final List<QuizQuestion> quiz;
  final List<LessonScenario> scenarios;
  final List<PortfolioItem> portfolio;

  const LessonData({
    required this.lessonId,
    required this.title,
    required this.lessonOrder,
    required this.duration,
    required this.objective,
    required this.contentBody,
    required this.completionType,
    required this.videoAssetId,
    required this.reflectionQuestion,
    required this.published,
    this.videoUrl = '',
    this.assessmentUrl = '',
    this.resourceUrl = '',
    this.resourceLabel = '',
    this.attachments = const [],
    this.exercises = const [],
    this.coaches = const [],
    this.quiz = const [],
    this.scenarios = const [],
    this.portfolio = const [],
  });

  factory LessonData.fromJson(Map<String, dynamic> json) {
    return LessonData(
      lessonId: json['lessonId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      lessonOrder: (json['lessonOrder'] as num?)?.toInt() ?? 0,
      duration: json['duration'] as String? ?? '',
      objective: json['objective'] as String? ?? '',
      contentBody: json['contentBody'] as String? ?? '',
      completionType: json['completionType'] as String? ?? 'button',
      videoAssetId: json['videoAssetId'] as String? ?? '',
      reflectionQuestion: json['reflectionQuestion'] as String? ?? '',
      published: json['published'] as bool? ?? true,
      videoUrl: json['videoUrl'] as String? ?? '',
      assessmentUrl: json['assessmentUrl'] as String? ?? '',
      resourceUrl: json['resourceUrl'] as String? ?? '',
      resourceLabel: json['resourceLabel'] as String? ?? '',
      attachments: (json['attachments'] as List? ?? [])
          .whereType<Map<String, dynamic>>()
          .map(LessonAttachment.fromJson)
          .where((a) => a.url.isNotEmpty)
          .toList(),
      exercises: _list(json['exercises'], LessonExercise.fromJson),
      coaches: _list(json['coaches'], LessonCoach.fromJson),
      quiz: _list(json['quiz'], QuizQuestion.fromJson),
      scenarios: _list(json['scenarios'], LessonScenario.fromJson),
      portfolio: _list(json['portfolio'], PortfolioItem.fromJson),
    );
  }
}

List<T> _list<T>(dynamic json, T Function(Map<String, dynamic>) f) =>
    (json as List? ?? []).whereType<Map<String, dynamic>>().map(f).toList();

class LessonAttachment {
  final String label;
  final String url;
  const LessonAttachment(this.label, this.url);

  factory LessonAttachment.fromJson(Map<String, dynamic> json) =>
      LessonAttachment(
        json['label'] as String? ?? 'Download',
        json['url'] as String? ?? '',
      );
}

/// A course category from /api/listCourses, in display order.
class CourseCategory {
  final String id;
  final String name;
  const CourseCategory(this.id, this.name);

  factory CourseCategory.fromJson(Map<String, dynamic> json) => CourseCategory(
      json['id'] as String? ?? '', json['name'] as String? ?? '');
}

/// Course card data from /api/listCourses (no lesson bodies).
class CourseSummary {
  final String courseId;
  final String title;
  final String description;
  final String level;
  final String estimatedDuration;
  final int lessonCount;
  final String category;

  const CourseSummary({
    required this.courseId,
    required this.title,
    required this.description,
    required this.level,
    required this.estimatedDuration,
    required this.lessonCount,
    this.category = '',
  });

  factory CourseSummary.fromJson(Map<String, dynamic> json) {
    return CourseSummary(
      courseId: json['courseId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      level: json['level'] as String? ?? '',
      estimatedDuration: json['estimatedDuration'] as String? ?? '',
      lessonCount: (json['lessonCount'] as num?)?.toInt() ?? 0,
      category: json['category'] as String? ?? '',
    );
  }
}

class CourseData {
  final String courseId;
  final String title;
  final String description;
  final String level;
  final String estimatedDuration;
  final bool certificateEligible;
  final List<LessonData> lessons;

  const CourseData({
    required this.courseId,
    required this.title,
    required this.description,
    required this.level,
    required this.estimatedDuration,
    required this.certificateEligible,
    required this.lessons,
  });

  factory CourseData.fromJson(Map<String, dynamic> json) {
    final lessons = (json['lessons'] as List? ?? [])
        .whereType<Map<String, dynamic>>()
        .map(LessonData.fromJson)
        .where((l) => l.published)
        .toList()
      ..sort((a, b) => a.lessonOrder.compareTo(b.lessonOrder));

    return CourseData(
      courseId: json['courseId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      level: json['level'] as String? ?? '',
      estimatedDuration: json['estimatedDuration'] as String? ?? '',
      certificateEligible: json['certificateEligible'] as bool? ?? false,
      lessons: lessons,
    );
  }

  LessonData? lessonById(String lessonId) {
    for (final lesson in lessons) {
      if (lesson.lessonId == lessonId) return lesson;
    }
    return null;
  }

  /// The lesson after [lessonId], or null if it is the last one.
  LessonData? nextLesson(String lessonId) {
    final index = lessons.indexWhere((l) => l.lessonId == lessonId);
    if (index == -1 || index + 1 >= lessons.length) return null;
    return lessons[index + 1];
  }
}
