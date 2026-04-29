import 'dart:convert';
import 'dart:html' as html;

import 'package:openidconnect_web/openidconnect_web.dart';

import 'app_auth_state.dart';
import 'entra_user.dart';

class EntraAuthService {
  // 🔐 TODO: replace with your real values
  static const String _clientId = '0df81530-47c8-4d89-ad12-e95a9f0b68c4';
  static const String _tenantId = '6691188-9b9d-47ee-bb5a-2afec52f4d5e';

  static final OpenIdConfiguration _config = OpenIdConfiguration(
    authority: 'https://login.microsoftonline.com/$_tenantId/v2.0',
    clientId: _clientId,
    scope: 'openid profile email',
    responseType: 'id_token',
    prompt: 'select_account',
    redirectUri: '${html.window.location.origin}/login',
  );

  /// Starts Microsoft Entra sign-in
  static Future<void> signIn(String? redirectAfter) async {
    final result = await OpenIdConnect.authorize(configuration: _config);

    final idToken = result.idToken;
    if (idToken == null) {
      throw Exception('No ID token returned from Entra');
    }

    final payload = _decodeJwtPayload(idToken);

    final roles = (payload['roles'] as List?)?.cast<String>() ?? [];

    AppAuthState.login(
      EntraUser(
        id: payload['oid'] ?? payload['sub'],
        email: payload['preferred_username'] ?? '',
        roles: roles,
      ),
    );
  }

  /// Clears local auth state
  static void signOut() {
    AppAuthState.logout();
  }

  // ---- Helpers ----

  static Map<String, dynamic> _decodeJwtPayload(String token) {
    final parts = token.split('.');
    if (parts.length != 3) {
      throw Exception('Invalid JWT');
    }

    final normalized = base64Url.normalize(parts[1]);
    final decoded = utf8.decode(base64Url.decode(normalized));
    return jsonDecode(decoded) as Map<String, dynamic>;
  }
}