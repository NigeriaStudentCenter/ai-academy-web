import 'entra_auth_service.dart';
import 'entra_user.dart';
import 'public_auth_service.dart';

/// How the learner signed in: Microsoft (school / TeenSkills accounts) or
/// Firebase (Google, Apple, email + password — the public).
enum SignInKind { microsoft, firebase }

class AppAuthState {
  static EntraUser? currentUser;
  static SignInKind provider = SignInKind.microsoft;

  /// Public learners' chosen sections: "teens" or "professional" (null until
  /// chosen). Microsoft accounts are routed by email domain.
  static String? track;

  static bool get isLoggedIn => currentUser != null;

  static bool get isAdmin => currentUser?.isAdmin ?? false;

  /// AI Academy for Teens learners (teenskills.co.uk) — and Admins. The
  /// backend enforces the same rule (src/lib/auth.js).
  static bool get isTeens =>
      isAdmin ||
      (provider == SignInKind.firebase
          ? track == 'teens'
          : (currentUser?.email.toLowerCase().endsWith('@teenskills.co.uk') ?? false));

  /// AI Academy (professional) learners: every domain except teenskills.co.uk
  /// — and Admins. Mirrors the backend's audience rule.
  static bool get isProfessional =>
      isAdmin ||
      (isLoggedIn &&
          (provider == SignInKind.firebase
              ? track != 'teens'
              : !currentUser!.email.toLowerCase().endsWith('@teenskills.co.uk')));

  static void login(EntraUser user, {SignInKind provider = SignInKind.microsoft}) {
    currentUser = user;
    AppAuthState.provider = provider;
  }

  /// A valid access token for the AI Academy API.
  static Future<String> getAccessToken() => provider == SignInKind.firebase
      ? PublicAuthService.getIdToken()
      : EntraAuthService.getAccessToken();

  /// Signs out of whichever service the learner used.
  static Future<void> signOut() => provider == SignInKind.firebase
      ? PublicAuthService.signOut()
      : EntraAuthService.signOut();

  static void logout() {
    currentUser = null;
    track = null;
  }
}
