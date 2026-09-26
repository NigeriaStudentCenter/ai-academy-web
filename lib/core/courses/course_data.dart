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
    );
  }
}

/// Course card data from /api/listCourses (no lesson bodies).
class CourseSummary {
  final String courseId;
  final String title;
  final String description;
  final String level;
  final String estimatedDuration;
  final int lessonCount;

  const CourseSummary({
    required this.courseId,
    required this.title,
    required this.description,
    required this.level,
    required this.estimatedDuration,
    required this.lessonCount,
  });

  factory CourseSummary.fromJson(Map<String, dynamic> json) {
    return CourseSummary(
      courseId: json['courseId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      level: json['level'] as String? ?? '',
      estimatedDuration: json['estimatedDuration'] as String? ?? '',
      lessonCount: (json['lessonCount'] as num?)?.toInt() ?? 0,
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
