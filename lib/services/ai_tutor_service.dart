import 'dart:convert';
import 'package:http/http.dart' as http;

class AITutorService {
  // ✅ Production: hosted proxy (Azure Function aiChat) that calls the
  // Foundry AI-Tutor-Agent with a managed identity — no key in the app.
  static const String _hostedEndpoint =
      "https://ai-academy-progress-api-bucjc4gtcsenhuhs.swedencentral-01.azurewebsites.net/api/aiChat";

  // ✅ Optional override for local development against ai-backend/server.js
  // Example: flutter run --dart-define=BACKEND_URL=http://localhost:3000/ai/chat
  static const String _backendOverride =
      String.fromEnvironment("BACKEND_URL");

  /// Used by chat, voice tutor, exam mode
  static Future<String> sendMessage(String prompt) async {
    final String endpointToUse =
        _backendOverride.isNotEmpty ? _backendOverride : _hostedEndpoint;

    final response = await http
        .post(
          Uri.parse(endpointToUse),
          headers: const {"Content-Type": "application/json"},
          body: jsonEncode({"input": prompt}),
        )
        // Allows for backend cold start (~30s) plus the model response.
        .timeout(const Duration(seconds: 60));

    if (response.statusCode != 200) {
      throw Exception("HTTP ${response.statusCode}: ${response.body}");
    }

    // ✅ Parse JSON safely
    final dynamic decoded = jsonDecode(response.body);

    // ✅ Case 1: Backend proxy returns { "text": "...", "raw": {...} }
    final proxyText = decoded is Map ? decoded["text"] : null;
    if (proxyText is String && proxyText.trim().isNotEmpty) {
      return proxyText;
    }

    // ✅ Case 2: Foundry direct returns Responses format with "output"
    final output = decoded is Map ? decoded["output"] : null;
    if (output is List && output.isNotEmpty) {
      final content = output[0]["content"];
      if (content is List && content.isNotEmpty) {
        final text = content[0]["text"];
        if (text is String && text.trim().isNotEmpty) return text;
      }
    }

    // ✅ Fallback used if structure changes
    return "No response generated.";
  }

  /// Used by AI Notes + PDF export
  static Future<String> generateStructuredNotes(String topic) async {
    final prompt = """
You are an expert study tutor.

Create well-formatted study notes.

Formatting rules:
- Clear section headings
- Bullet points
- Simple explanations
- Key Points Summary
- Exam Tips section

Topic:
$topic
""";

    return sendMessage(prompt);
  }
}