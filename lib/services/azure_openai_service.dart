import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class AzureOpenAIService {
  final String endpoint = dotenv.env['AZURE_OPENAI_ENDPOINT']!;
  final String apiKey = dotenv.env['AZURE_OPENAI_API_KEY']!;
  final String deployment = dotenv.env['AZURE_OPENAI_DEPLOYMENT']!;

  Future<String> askAI(String prompt) async {
    final url =
        "$endpoint/openai/deployments/$deployment/chat/completions?api-version=2024-02-15-preview";

    final response = await http.post(
      Uri.parse(url),
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: jsonEncode({
        "messages": [
          {"role": "system", "content": "You are an AI Tutor for young learners."},
          {"role": "user", "content": prompt}
        ],
        "max_tokens": 512,
        "temperature": 0.7
      }),
    );

    final data = json.decode(response.body);
    return data["choices"][0]["message"]["content"];
  }
}