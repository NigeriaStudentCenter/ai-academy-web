import 'curriculum_registry.dart';
import 'progress_service.dart';

class CurriculumProgressService {
  static Future<double> completionPercentage({
    required String track,
    required String program,
    required String subject,
  }) async {
    final topics = List<String>.from(
      CurriculumRegistry
          .registry[track]![program]!['subjects'][subject],
    );

    if (topics.isEmpty) return 0;

    int completed = 0;

    for (final topic in topics) {
      final mastery =
          await ProgressService.getMasteryLevel(topic);
      if (mastery == 'strong') {
        completed++;
      }
    }

    return completed / topics.length;
  }

  static Future<String?> nextTopic({
    required String track,
    required String program,
    required String subject,
  }) async {
    final topics = List<String>.from(
      CurriculumRegistry
          .registry[track]![program]!['subjects'][subject],
    );

    for (final topic in topics) {
      final mastery =
          await ProgressService.getMasteryLevel(topic);
      if (mastery != 'strong') {
        return topic;
      }
    }

    return null;
  }
}