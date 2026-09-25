import 'package:http/http.dart' as http;

import '../auth/entra_auth_service.dart';

/// Signed-in calls to the AI Academy backend (Azure Functions).
class ApiClient {
  static const String baseUrl =
      'https://ai-academy-progress-api-bucjc4gtcsenhuhs.swedencentral-01.azurewebsites.net/api';

  // Generous: the Flex Consumption backend can take ~30s to cold start.
  static const Duration _timeout = Duration(seconds: 45);

  static Future<Map<String, String>> _headers() async => {
        'Authorization': 'Bearer ${await EntraAuthService.getAccessToken()}',
        'Content-Type': 'application/json',
      };

  static Future<http.Response> get(String path,
      [Map<String, String>? query]) async {
    final uri = Uri.parse('$baseUrl/$path').replace(queryParameters: query);
    return _check(await http.get(uri, headers: await _headers()).timeout(_timeout));
  }

  static Future<http.Response> post(String path, String body,
      {Duration? timeout}) async {
    return _check(await http
        .post(Uri.parse('$baseUrl/$path'), headers: await _headers(), body: body)
        .timeout(timeout ?? _timeout));
  }

  /// A 401 means the token was rejected — sign out so the router sends the
  /// learner back to the sign-in page.
  static Future<http.Response> _check(http.Response response) async {
    if (response.statusCode == 401) {
      await EntraAuthService.signOut();
      throw Exception('Your session has expired. Please sign in again.');
    }
    return response;
  }
}
