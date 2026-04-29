import 'progress_service.dart';
import 'curriculum_registry.dart';

class AdaptiveRevisionService {
  /// Get next recommended topic based on curriculum + progress
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
      // 🔁 Stay on same topic
      return currentTopic;
    }

    if (mastery == "improving") {
      // ➡️ Move forward if possible
      if (currentIndex + 1 < topics.length) {
        return topics[currentIndex + 1];
      }
      return currentTopic;
    }

    // ✅ Strong mastery
    if (currentIndex + 1 < topics.length) {
      return topics[currentIndex + 1];
    }

    // ✅ Last topic — no next topic
    return currentTopic;
  }
}