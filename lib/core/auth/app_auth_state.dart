import 'entra_user.dart';

class AppAuthState {
  static EntraUser? currentUser;
  static String? _accessToken;

  static bool get isLoggedIn => currentUser != null;

  static bool get isAdmin => currentUser?.isAdmin ?? false;

  static void login(EntraUser user, {String? accessToken}) {
    currentUser = user;
    if (accessToken != null && accessToken.isNotEmpty) {
      _accessToken = accessToken;
    }
  }

  static void setAccessToken(String? token) {
    _accessToken = token;
  }

  static Future<String> getAccessToken() async {
    if (_accessToken != null && _accessToken!.isNotEmpty) {
      return _accessToken!;
    }

    throw Exception('No access token available. Please sign in again.');
  }

  static void logout() {
    currentUser = null;
    _accessToken = null;
  }
}
