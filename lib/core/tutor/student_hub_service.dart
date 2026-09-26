import 'dart:convert';

import '../api/api_client.dart';

/// One form field of a Student Success Hub tool.
class HubField {
  final String id;
  final String label;
  final String type; // text | select | textarea | file
  final String hint;
  final bool required;
  final List<String> options;

  const HubField({
    required this.id,
    required this.label,
    required this.type,
    this.hint = '',
    this.required = false,
    this.options = const [],
  });

  factory HubField.fromJson(Map<String, dynamic> json) => HubField(
        id: json['id'] as String? ?? '',
        label: json['label'] as String? ?? '',
        type: json['type'] as String? ?? 'text',
        hint: json['hint'] as String? ?? '',
        required: json['required'] as bool? ?? false,
        options:
            (json['options'] as List? ?? []).map((o) => o.toString()).toList(),
      );
}

class HubTool {
  final String id;
  final String name;
  final String summary;
  final String icon;
  final String note;
  final List<HubField> fields;

  const HubTool({
    required this.id,
    required this.name,
    required this.summary,
    required this.icon,
    required this.note,
    required this.fields,
  });

  factory HubTool.fromJson(Map<String, dynamic> json) => HubTool(
        id: json['id'] as String? ?? '',
        name: json['name'] as String? ?? '',
        summary: json['summary'] as String? ?? '',
        icon: json['icon'] as String? ?? '',
        note: json['note'] as String? ?? '',
        fields: (json['fields'] as List? ?? [])
            .whereType<Map<String, dynamic>>()
            .map(HubField.fromJson)
            .toList(),
      );
}

/// An uploaded assessment brief (PDF, image or .txt).
class HubBrief {
  final String name;
  final List<int> bytes;
  const HubBrief(this.name, this.bytes);
}

/// Student Success Hub — /api/studentHub. Searches the live web, so a run
/// can take up to a couple of minutes.
class StudentHubService {
  static const _timeout = Duration(seconds: 180);
  static List<HubTool>? _tools;

  static String _error(String body, String fallback) {
    try {
      return (jsonDecode(body) as Map<String, dynamic>)['error'] as String? ??
          fallback;
    } catch (_) {
      return fallback;
    }
  }

  static Future<List<HubTool>> tools() async {
    if (_tools != null) return _tools!;
    final response = await ApiClient.get('studentHub');
    if (response.statusCode != 200) {
      throw Exception(
          _error(response.body, 'Could not load the Student Success Hub.'));
    }
    _tools =
        ((jsonDecode(response.body) as Map<String, dynamic>)['tools'] as List)
            .whereType<Map<String, dynamic>>()
            .map(HubTool.fromJson)
            .toList();
    return _tools!;
  }

  static Future<String> run(String toolId, Map<String, String> answers,
      {HubBrief? brief}) async {
    final response = await ApiClient.post(
        'studentHub',
        jsonEncode({
          'tool': toolId,
          'answers': answers,
          if (brief != null)
            'brief': {'name': brief.name, 'data': base64Encode(brief.bytes)},
        }),
        timeout: _timeout);
    if (response.statusCode != 200) {
      throw Exception(
          _error(response.body, 'Could not get a result — please try again.'));
    }
    return (jsonDecode(response.body) as Map<String, dynamic>)['text']
            as String? ??
        '';
  }
}
