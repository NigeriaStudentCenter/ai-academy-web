import 'app_auth_state.dart';
import 'entra_user.dart';

/// Temporary stub for Microsoft Entra authentication.
///
/// This allows the app to compile and deploy.
/// Real Entra OAuth will be added after deployment succeeds.
class EntraAuthService {
  static Future<void> signIn(String? redirectTo) async {
    // ✅ TEMP: Simulated authenticated user
    AppAuthState.login(
      EntraUser(
        id: 'entra-stub-user',
        email: 'user@aiacademy.dev',
        roles: const ['Admin'],
      ),
    );
  }

  static void signOut() {
    AppAuthState.logout();
  }
}