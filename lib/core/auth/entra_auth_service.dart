import '../courses/course_api_service.dart';
import 'app_auth_state.dart';
import 'auth_platform.dart';
import 'entra_user.dart';
import 'token_set.dart';

/// Microsoft Entra ID sign-in for web, iOS and Android.
///
/// Holds the current tokens, keeps them fresh, and mirrors the signed-in
/// learner into [AppAuthState] for the router and UI.
class EntraAuthService {
  static TokenSet? _tokens;

  /// Restores a saved session on app start (refreshing it if needed).
  static Future<void> restoreSession() async {
    try {
      var tokens = await AuthPlatform.load();
      if (tokens == null) return;
      if (tokens.isExpired) tokens = await AuthPlatform.refresh(tokens);
      if (tokens == null) {
        await AuthPlatform.save(null);
        return;
      }
      await _setTokens(tokens);
    } catch (_) {
      await AuthPlatform.save(null);
    }
  }

  /// Starts Microsoft sign-in. On the web this navigates away and the flow
  /// finishes in [completeWebRedirect]; on mobile it completes here.
  static Future<void> signIn(String? redirectAfter) async {
    final tokens = await AuthPlatform.signIn(redirectAfter);
    if (tokens != null) await _setTokens(tokens);
  }

  /// Web only: exchanges the code on /oauth/callback. Returns the route the
  /// learner was heading to.
  static Future<String?> completeWebRedirect(Uri uri) async {
    final (tokens, redirectAfter) = await AuthPlatform.completeRedirect(uri);
    await _setTokens(tokens);
    return redirectAfter;
  }

  /// A valid access token for the AI Academy API, refreshing if needed.
  static Future<String> getAccessToken() async {
    var tokens = _tokens;
    if (tokens == null) {
      throw Exception('Not signed in. Please sign in again.');
    }
    if (tokens.isExpired) {
      tokens = await AuthPlatform.refresh(tokens);
      if (tokens == null) {
        await signOut();
        throw Exception('Your session has expired. Please sign in again.');
      }
      await _setTokens(tokens);
    }
    return tokens.accessToken;
  }

  static Future<void> signOut() async {
    _tokens = null;
    await AuthPlatform.save(null);
    CourseApiService.clearCache();
    AppAuthState.logout();
  }

  static Future<void> _setTokens(TokenSet tokens) async {
    _tokens = tokens;
    await AuthPlatform.save(tokens);

    final claims = tokens.claims;
    AppAuthState.login(EntraUser(
      id: claims['oid'] as String? ?? '',
      email: (claims['upn'] ?? claims['preferred_username'] ?? claims['email'] ?? '')
          as String,
      name: claims['name'] as String? ?? '',
      roles: (claims['roles'] as List?)?.cast<String>() ?? const [],
    ));
  }
}
