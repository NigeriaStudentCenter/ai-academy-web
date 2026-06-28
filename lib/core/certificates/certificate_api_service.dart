import 'dart:convert';
import 'package:http/http.dart' as http;

import '../auth/app_auth_state.dart';
import 'course_certificate.dart';

class CertificateApiService {
  static const String _baseUrl =
      'https://ai-academy-progress-api-bucjc4gtcsenhuhs.swedencentral-01.azurewebsites.net/api';

  static Future<List<CourseCertificate>> fetchCertificates() async {
    final token = await AppAuthState.getAccessToken();

    final response = await http.get(
      Uri.parse('$_baseUrl/getCertificates'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data
          .map((item) => CourseCertificate.fromJson(
                Map<String, dynamic>.from(item),
              ))
          .toList();
    }

    if (response.statusCode == 401) {
      throw Exception('Unauthorized: please sign in again.');
    }

    throw Exception(
      'Failed to fetch certificates (status ${response.statusCode}).',
    );
  }

  static Future<CourseCertificate?> verifyCertificate(
    String certificateId,
  ) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/verifyCertificate/$certificateId'),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return CourseCertificate.fromJson(
        Map<String, dynamic>.from(data),
      );
    }

    if (response.statusCode == 404) {
      return null;
    }

    throw Exception(
      'Failed to verify certificate (status ${response.statusCode}).',
    );
  }
}