import 'dart:convert';
import 'package:http/http.dart' as http;

class AITutorService {
  // ✅ Production (direct Foundry) – keep for advanced/testing only
  // NOTE: api-version value must match what your Foundry endpoint expects.
  static const String _endpoint =
      "https://AI-Tutor-Agent.services.ai.azure.com"
      "/api/projects/aiacademy/applications/AI-Tutor-Agent"
      "/protocols/openai/responses"
      "?api-version=v1";

  // ✅ Development (your local Node proxy) – iPhone Simulator uses localhost
  static const String _devEndpoint = "http://localhost:3000/ai/chat";

  // ✅ Optional override (for later: real device or hosted backend)
  // Example: flutter run --dart-define=BACKEND_URL=http://192.168.1.23:3000/ai/chat
  static const String _backendOverride =
      String.fromEnvironment("BACKEND_URL");

  static const String _apiKey = String.fromEnvironment("AZURE_AI_API_KEY");

  /// Used by chat, voice tutor, exam mode
  static Future<String> sendMessage(String prompt) async {
    // ✅ Decide which endpoint to call
    // If an API key is provided, call Foundry directly.
    // If no API key is provided, call local backend proxy (dev mode),
    // unless BACKEND_URL is provided.
    final String endpointToUse = _apiKey.isNotEmpty
        ? _endpoint
        : (_backendOverride.isNotEmpty ? _backendOverride : _devEndpoint);

    final Map<String, String> headers = {
      "Content-Type": "application/json",
    };

    // ✅ Only attach api-key header when calling Foundry directly
    if (_apiKey.isNotEmpty) {
      headers["api-key"] = _apiKey;
    }

    final response = await http
        .post(
          Uri.parse(endpointToUse),
          headers: headers,
          body: jsonEncode({"input": prompt}),
        )
        .timeout(const Duration(seconds: 30));

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