import 'entra_auth_service.dart';
import 'entra_user.dart';

class AppAuthState {
  static EntraUser? currentUser;

  static bool get isLoggedIn => currentUser != null;

  static bool get isAdmin => currentUser?.isAdmin ?? false;

  /// AI Academy for Teens learners (teenskills.co.uk) — and Admins. The
  /// backend enforces the same rule (src/lib/auth.js).
  static bool get isTeens =>
      isAdmin ||
      (currentUser?.email.toLowerCase().endsWith('@teenskills.co.uk') ?? false);

  static void login(EntraUser user) {
    currentUser = user;
  }

  /// A valid access token for the AI Academy API.
  static Future<String> getAccessToken() => EntraAuthService.getAccessToken();

  static void logout() {
    currentUser = null;
  }
}
