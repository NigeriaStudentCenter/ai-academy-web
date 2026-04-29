import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';

import 'package:ai_academy/services/ai_tutor_service.dart';
import 'package:ai_academy/services/adaptive_revision_service.dart';
import 'package:ai_academy/services/curriculum_state_service.dart';
import 'package:ai_academy/services/progress_service.dart';
import 'package:ai_academy/services/topic_completion_service.dart';

import '../../widgets/app_nav_drawer.dart';

class AIChatPage extends StatefulWidget {
  const AIChatPage({super.key});

  @override
  State<AIChatPage> createState() => _AIChatPageState();
}

class _AIChatPageState extends State<AIChatPage> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<_ChatMessage> _messages = [];

  late stt.SpeechToText _speech;
  late FlutterTts _tts;

  bool _speechReady = false;
  bool _isListening = false;
  bool _isLoading = false;

  late final Map<String, dynamic> _curriculum;

  @override
  void initState() {
    super.initState();

    _speech = stt.SpeechToText();
    _tts = FlutterTts();
    _configureTts();
    _initSpeech();

    final args = Get.arguments;
    if (args is Map) {
      _curriculum = Map<String, dynamic>.from(args);
    } else {
      _curriculum = {};
    }

    if (_messages.isEmpty) {
      final topic = _curriculum["topic"] ?? "this topic";
      _addAssistantMessage(
        "Hello. I am your AI Tutor. Ask me a question about $topic.",
      );
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    _speech.stop();
    _tts.stop();
    super.dispose();
  }

  Future<void> _configureTts() async {
    await _tts.setLanguage("en-US");
    await _tts.setSpeechRate(0.42);
    await _tts.setPitch(1.0);
  }

  Future<void> _initSpeech() async {
    try {
      _speechReady = await _speech.initialize(
        onStatus: (status) {
          if (status == "notListening" || status == "done") {
            if (mounted) setState(() => _isListening = false);
          }
        },
        onError: (error) {
          if (mounted) setState(() => _isListening = false);
          _addAssistantMessage("Voice input error: ${error.errorMsg}");
        },
      );
      if (mounted) setState(() {});
    } catch (_) {
      _speechReady = false;
      if (mounted) setState(() {});
    }
  }

  Future<void> _startListening() async {
    if (_isLoading || !_speechReady) return;

    await _tts.stop();
    HapticFeedback.lightImpact();

    setState(() => _isListening = true);

    await _speech.listen(
      listenMode: stt.ListenMode.confirmation,
      partialResults: true,
      onResult: (result) {
        setState(() {
          _controller.text = result.recognizedWords;
          _controller.selection = TextSelection.fromPosition(
            TextPosition(offset: _controller.text.length),
          );
        });

        if (result.finalResult) {
          _stopListening();
          final text = _controller.text.trim();
          _controller.clear();
          _sendText(text);
        }
      },
    );
  }

  Future<void> _stopListening() async {
    HapticFeedback.lightImpact();
    await _speech.stop();
    if (mounted) setState(() => _isListening = false);
  }

  void _addUserMessage(String text) {
    _messages.add(_ChatMessage(text: text, isUser: true));
    _scrollToBottom();
  }

  void _addAssistantMessage(String text) {
    _messages.add(_ChatMessage(text: text, isUser: false));
    _scrollToBottom();
  }

  void _addCompletionPrompt() {
    _messages.add(
      _ChatMessage(
        text:
            "You have shown good understanding of this topic.\n\nWould you like to mark it as complete?",
        isUser: false,
        isCompletionPrompt: true,
      ),
    );
    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scrollController.hasClients) return;
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
      );
    });
  }

  Future<void> _sendText(String text) async {
    final cleaned = text.trim();
    if (cleaned.isEmpty || _isLoading) return;

    if (_isListening) await _stopListening();
    await _tts.stop();

    setState(() {
      _isLoading = true;
      _addUserMessage(cleaned);
    });

    try {
      final track = _curriculum["track"] ?? "Academic";
      final program = _curriculum["program"] ?? "General";
      final subject = _curriculum["subject"] ?? "AI";
      final currentTopic = _curriculum["topic"] ?? "AI Basics";

      final nextTopic = await AdaptiveRevisionService.recommendNextTopic(
        track: track,
        program: program,
        subject: subject,
        currentTopic: currentTopic,
      );

      final prompt = """
You are an AI tutor guiding learning through a curriculum.

Track: $track
Program: $program
Subject: $subject

Current topic: $currentTopic
Next recommended topic: $nextTopic

Learner message:
$cleaned

Respond in simple English.
Explain step by step.
Use short sentences.
Ask the learner if they understand before continuing.
""";

      final reply = await AITutorService.sendMessage(prompt);

      _addAssistantMessage(reply);
      await _tts.speak(reply);

      // ✅ FIX: mastery parsing (String → double)
      final masteryRaw =
          await ProgressService.getMasteryLevel(currentTopic);

      final mastery =
          double.tryParse(masteryRaw.toString()) ?? 0.0;

      if (mastery >= 0.8) {
        _addCompletionPrompt();
      }
    } catch (e) {
      _addAssistantMessage(
        "Sorry. Something went wrong while contacting the AI Tutor.",
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final canSend =
        !_isLoading && _controller.text.trim().isNotEmpty;

    return Scaffold(
      drawer: const AppNavDrawer(),
      appBar: AppBar(
        title: const Text("AI Tutor"),
        actions: [
          IconButton(
            tooltip: "Back to Course",
            icon: const Icon(Icons.home),
            onPressed: () => Get.offAllNamed("/course"),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final m = _messages[index];

                return Align(
                  alignment: m.isUser
                      ? Alignment.centerRight
                      : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    padding: const EdgeInsets.all(12),
                    constraints:
                        const BoxConstraints(maxWidth: 320),
                    decoration: BoxDecoration(
                      color: m.isUser
                          ? Colors.blue
                          : Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment:
                          CrossAxisAlignment.start,
                      children: [
                        Text(
                          m.text,
                          style: TextStyle(
                            color: m.isUser
                                ? Colors.white
                                : Colors.black87,
                          ),
                        ),
                        if (m.isCompletionPrompt)
                          Padding(
                            padding:
                                const EdgeInsets.only(top: 12),
                            child: Row(
                              children: [
                                ElevatedButton(
                                  onPressed: () async {
                                    await TopicCompletionService
                                        .markCompleted(
                                      track:
                                          _curriculum["track"],
                                      program:
                                          _curriculum["program"],
                                      subject:
                                          _curriculum["subject"],
                                      topic:
                                          _curriculum["topic"],
                                    );
                                    _addAssistantMessage(
                                      
"🎉 This topic is now marked as complete.\n\n"
      "You have done well.\n\n"
      "You can move on to the next topic, or stay here and revise anytime. "
      "I am here to help.",

                                    );
                                  },
                                  child: const Text(
                                      "Yes, mark complete"),
                                ),
                                const SizedBox(width: 8),
                                OutlinedButton(
                                  onPressed: () {
                                    _addAssistantMessage(
                                      "No problem. Ask me more questions when ready.",
                                    );
                                  },
                                  child:
                                      const Text("Not yet"),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          if (_isLoading) const LinearProgressIndicator(),

          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(
                    _isListening
                        ? Icons.mic
                        : Icons.mic_none,
                    color:
                        _isListening ? Colors.red : null,
                  ),
                  onPressed: _isLoading
                      ? null
                      : () {
                          _isListening
                              ? _stopListening()
                              : _startListening();
                        },
                ),
                Expanded(
                  child: TextField(
                    controller: _controller,
                    minLines: 1,
                    maxLines: 4,
                    decoration: const InputDecoration(
                      hintText: "Ask or revise…",
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                    onSubmitted: (v) {
                      final text = v.trim();
                      _controller.clear();
                      _sendText(text);
                    },
                  ),
                ),
                IconButton(
                  icon: Icon(
                    Icons.send,
                    color:
                        canSend ? Colors.blue : Colors.grey,
                  ),
                  onPressed: canSend
                      ? () {
                          final text = _controller.text;
                          _controller.clear();
                          _sendText(text);
                        }
                      : null,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ChatMessage {
  final String text;
  final bool isUser;
  final bool isCompletionPrompt;

  _ChatMessage({
    required this.text,
    required this.isUser,
    this.isCompletionPrompt = false,
  });
}