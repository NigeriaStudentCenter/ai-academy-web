import 'progress_service.dart';
import 'curriculum_registry.dart';

class AdaptiveRevisionService {
  static Future<String> recommendNextTopic({
    required String track,
    required String program,
    required String subject,
    required String currentTopic,
  }) async {
    final mastery =
        await ProgressService.getMasteryLevel(currentTopic);

    final topics = List<String>.from(
      CurriculumRegistry
          .registry[track]![program]!['subjects'][subject],
    );

    final currentIndex = topics.indexOf(currentTopic);

    if (mastery == "weak") {
      return currentTopic;
    }

    if (mastery == "improving") {
      if (currentIndex + 1 < topics.length) {
        return topics[currentIndex + 1];
      }
      return currentTopic;
    }

    if (currentIndex + 1 < topics.length) {
      return topics[currentIndex + 1];
    }

    return currentTopic;
  }
}
``