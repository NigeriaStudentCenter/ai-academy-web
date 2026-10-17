import 'dart:convert';

import '../api/api_client.dart';
import '../auth/app_auth_state.dart';

/// Teens or Professional sections for public learners (Google, Apple, email
/// sign-in). Microsoft accounts are routed by their email domain.
class LearnerProfileService {
  /// Loads the learner's track into [AppAuthState]; true if they still need
  /// to choose (first sign-in of a public learner).
  static Future<bool> needsTrack() async {
    if (AppAuthState.provider != SignInKind.firebase) return false;
    try {
      final response = await ApiClient.get('profile');
      if (response.statusCode != 200) return false;
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      AppAuthState.track = json['track'] as String?;
      return json['needsTrack'] == true;
    } catch (_) {
      return false; // Don't block sign-in; they can choose later in Account.
    }
  }

  static Future<void> setTrack(String track) async {
    final response = await ApiClient.post('profile', jsonEncode({'track': track}));
    if (response.statusCode != 200) {
      throw Exception('Could not save your choice (HTTP ${response.statusCode}).');
    }
    AppAuthState.track = track;
  }
}
