import 'dart:convert';
import 'dart:math';

import 'package:crypto/crypto.dart';
import 'package:http/http.dart' as http;
import 'package:web/web.dart' as web;

import 'auth_config.dart';
import 'token_set.dart';

/// Web sign-in: OAuth 2.0 authorization code flow with PKCE, using a full-page
/// redirect to Microsoft and back to /oauth/callback (SPA redirect in Entra).
class AuthPlatform {
  static const String _pkceKey = 'aia_pkce';
  static const String _tokensKey = 'aia_tokens';

  static String get _redirectUri =>
      '${web.window.location.origin}${AuthConfig.webCallbackPath}';

  static String get _tokenEndpoint =>
      '${AuthConfig.authority}/oauth2/v2.0/token';

  static String _randomString(int length) {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    final rnd = Random.secure();
    return List.generate(length, (_) => chars[rnd.nextInt(chars.length)]).join();
  }

  /// Navigates away to Microsoft; returns null because the page unloads.
  static Future<TokenSet?> signIn(String? redirectAfter) async {
    final verifier = _randomString(64);
    final state = _randomString(32);
    final challenge = base64Url
        .encode(sha256.convert(ascii.encode(verifier)).bytes)
        .replaceAll('=', '');

    web.window.sessionStorage.setItem(
      _pkceKey,
      jsonEncode({
        'verifier': verifier,
        'state': state,
        'redirectAfter': redirectAfter,
      }),
    );

    final url = Uri.parse('${AuthConfig.authority}/oauth2/v2.0/authorize')
        .replace(queryParameters: {
      'client_id': AuthConfig.clientId,
      'response_type': 'code',
      'redirect_uri': _redirectUri,
      'response_mode': 'query',
      'scope': AuthConfig.scopes.join(' '),
      'state': state,
      'code_challenge': challenge,
      'code_challenge_method': 'S256',
      'prompt': 'select_account',
    });

    web.window.location.assign(url.toString());
    return null;
  }

  /// Finishes sign-in on /oauth/callback. Returns the tokens and the route
  /// the learner was heading to before sign-in.
  static Future<(TokenSet, String?)> completeRedirect(Uri uri) async {
    final params = uri.queryParameters;
    if (params['error'] != null) {
      throw Exception(params['error_description'] ?? params['error']);
    }

    final saved = web.window.sessionStorage.getItem(_pkceKey);
    web.window.sessionStorage.removeItem(_pkceKey);
    if (saved == null) {
      throw Exception('Sign-in session expired. Please try again.');
    }
    final pkce = jsonDecode(saved) as Map<String, dynamic>;
    if (params['state'] != pkce['state'] || params['code'] == null) {
      throw Exception('Sign-in response did not match. Please try again.');
    }

    final response = await http.post(Uri.parse(_tokenEndpoint), body: {
      'client_id': AuthConfig.clientId,
      'grant_type': 'authorization_code',
      'code': params['code']!,
      'redirect_uri': _redirectUri,
      'code_verifier': pkce['verifier'] as String,
      'scope': AuthConfig.scopes.join(' '),
    });
    final json = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode != 200) {
      throw Exception(json['error_description'] ?? 'Sign-in failed.');
    }

    return (
      TokenSet.fromTokenResponse(json),
      pkce['redirectAfter'] as String?,
    );
  }

  /// Returns fresh tokens, or null if the refresh token is no longer valid.
  static Future<TokenSet?> refresh(TokenSet tokens) async {
    final refreshToken = tokens.refreshToken;
    if (refreshToken == null) return null;

    final response = await http.post(Uri.parse(_tokenEndpoint), body: {
      'client_id': AuthConfig.clientId,
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken,
      'scope': AuthConfig.scopes.join(' '),
    });
    if (response.statusCode != 200) return null;

    return TokenSet.fromTokenResponse(
      jsonDecode(response.body) as Map<String, dynamic>,
      previousRefreshToken: refreshToken,
    );
  }

  static Future<void> save(TokenSet? tokens) async {
    if (tokens == null) {
      web.window.localStorage.removeItem(_tokensKey);
    } else {
      web.window.localStorage.setItem(_tokensKey, jsonEncode(tokens.toJson()));
    }
  }

  static Future<TokenSet?> load() async =>
      TokenSet.fromJson(web.window.localStorage.getItem(_tokensKey));
}
