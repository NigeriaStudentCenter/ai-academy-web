import 'dart:convert';

/// Tokens returned by Entra ID for the AI Academy API.
class TokenSet {
  final String accessToken;
  final String? refreshToken;
  final DateTime expiresAt;

  const TokenSet({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresAt,
  });

  /// Treat tokens as expired 5 minutes early so calls never race expiry.
  bool get isExpired =>
      DateTime.now().isAfter(expiresAt.subtract(const Duration(minutes: 5)));

  /// Claims from the access token (oid, name, upn, roles, ...).
  Map<String, dynamic> get claims {
    final parts = accessToken.split('.');
    if (parts.length != 3) return {};
    try {
      return jsonDecode(utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))))
          as Map<String, dynamic>;
    } catch (_) {
      return {};
    }
  }

  /// Builds a TokenSet from an OAuth token endpoint JSON response.
  /// Entra may omit refresh_token on refresh; keep the previous one then.
  factory TokenSet.fromTokenResponse(Map<String, dynamic> json,
      {String? previousRefreshToken}) {
    final expiresIn = (json['expires_in'] as num?)?.toInt() ?? 3600;
    return TokenSet(
      accessToken: json['access_token'] as String,
      refreshToken: json['refresh_token'] as String? ?? previousRefreshToken,
      expiresAt: DateTime.now().add(Duration(seconds: expiresIn)),
    );
  }

  Map<String, dynamic> toJson() => {
        'accessToken': accessToken,
        'refreshToken': refreshToken,
        'expiresAt': expiresAt.toIso8601String(),
      };

  static TokenSet? fromJson(String? raw) {
    if (raw == null || raw.isEmpty) return null;
    try {
      final json = jsonDecode(raw) as Map<String, dynamic>;
      return TokenSet(
        accessToken: json['accessToken'] as String,
        refreshToken: json['refreshToken'] as String?,
        expiresAt: DateTime.parse(json['expiresAt'] as String),
      );
    } catch (_) {
      return null;
    }
  }
}
