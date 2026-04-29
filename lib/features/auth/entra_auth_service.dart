import 'dart:convert';
import 'package:openidconnect_web/openidconnect_web.dart';

import 'entra_user.dart';
import 'app_auth_state.dart';

class EntraAuthService {
  static const _clientId = '<YOUR_CLIENT_ID>';
  static const _tenantId = '<YOUR_TENANT_ID>';

  static final _config = OpenIdConfiguration(
    authority:
        'https://login.microsoftonline.com/$_tenantId/v2.0',
    clientId: _clientId,
    scope: 'openid profile email',
    prompt: 'select_account',
  );

  static Future<void> signIn(String? redirectAfter) async {
    final result = await OpenIdConnect.authorize(
      configuration: _config,
    );

    final idToken = result.idToken!;
    final payload =
        json.decode(utf8.decode(base64Url.decode(
      base64Url.normalize(idToken.split('.')[1]),
    )));

    final roles =
        (payload['roles'] as List?)?.cast<String>() ?? [];

    AppAuthState.login(
      EntraUser(
        id: payload['oid'],
        email: payload['preferred_username'],
        roles: roles,
      ),
    );
  }

  static Future<void> signOut() async {
    AppAuthState.logout();
  }
}