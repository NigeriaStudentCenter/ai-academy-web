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

    final List<String> topics = List<String>.from(
      CurriculumRegistry
          .registry[track]![program]!['subjects'][subject],
    );

    final int index = topics.indexOf(currentTopic);

    if (mastery == 'weak') return currentTopic;

    if (index + 1 < topics.length) {
      return topics[index + 1];
    }

    return currentTopic;
  }
}