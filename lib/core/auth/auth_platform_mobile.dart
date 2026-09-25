import 'dart:convert';

import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'auth_config.dart';
import 'token_set.dart';

/// iOS/Android sign-in: AppAuth opens Microsoft sign-in in the system browser
/// (ASWebAuthenticationSession / Custom Tabs) and returns via the
/// org.bsoedu.aiacademy:// redirect. Tokens live in the Keychain/Keystore.
class AuthPlatform {
  static const FlutterAppAuth _appAuth = FlutterAppAuth();
  static const FlutterSecureStorage _storage = FlutterSecureStorage();
  static const String _tokensKey = 'aia_tokens';

  static const String _discoveryUrl =
      '${AuthConfig.authority}/v2.0/.well-known/openid-configuration';

  static Future<TokenSet?> signIn(String? redirectAfter) async {
    final result = await _appAuth.authorizeAndExchangeCode(
      AuthorizationTokenRequest(
        AuthConfig.clientId,
        AuthConfig.mobileRedirectUri,
        discoveryUrl: _discoveryUrl,
        scopes: AuthConfig.scopes,
        promptValues: const ['select_account'],
      ),
    );
    return _fromResult(result, null);
  }

  static Future<(TokenSet, String?)> completeRedirect(Uri uri) =>
      throw UnsupportedError('Redirect sign-in is only used on the web.');

  static Future<TokenSet?> refresh(TokenSet tokens) async {
    final refreshToken = tokens.refreshToken;
    if (refreshToken == null) return null;
    try {
      final result = await _appAuth.token(TokenRequest(
        AuthConfig.clientId,
        AuthConfig.mobileRedirectUri,
        discoveryUrl: _discoveryUrl,
        refreshToken: refreshToken,
        scopes: AuthConfig.scopes,
      ));
      return _fromResult(result, refreshToken);
    } catch (_) {
      return null;
    }
  }

  static TokenSet? _fromResult(TokenResponse result, String? previousRefresh) {
    final accessToken = result.accessToken;
    if (accessToken == null) return null;
    return TokenSet(
      accessToken: accessToken,
      refreshToken: result.refreshToken ?? previousRefresh,
      expiresAt: result.accessTokenExpirationDateTime ??
          DateTime.now().add(const Duration(hours: 1)),
    );
  }

  static Future<void> save(TokenSet? tokens) async {
    if (tokens == null) {
      await _storage.delete(key: _tokensKey);
    } else {
      await _storage.write(key: _tokensKey, value: jsonEncode(tokens.toJson()));
    }
  }

  static Future<TokenSet?> load() async =>
      TokenSet.fromJson(await _storage.read(key: _tokensKey));
}

