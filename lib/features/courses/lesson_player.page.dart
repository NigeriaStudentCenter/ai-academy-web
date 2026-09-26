import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:chewie/chewie.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:video_player/video_player.dart';
import 'package:go_router/go_router.dart';

import '../../core/courses/course_api_service.dart';
import '../../core/courses/course_data.dart';

class LessonPlayerPage extends StatefulWidget {
  final String courseId;
  final String lessonId;

  const LessonPlayerPage({
    super.key,
    required this.courseId,
    required this.lessonId,
  });

  @override
  State<LessonPlayerPage> createState() => _LessonPlayerPageState();
}

class _LessonPlayerPageState extends State<LessonPlayerPage> {
  CourseData? course;
  bool completed = false;
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void didUpdateWidget(LessonPlayerPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.lessonId != widget.lessonId ||
        oldWidget.courseId != widget.courseId) {
      _load();
    }
  }

  Future<void> _load() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final loaded = await CourseApiService.getCourse(widget.courseId);
      final done = await CourseApiService.completedLessons(widget.courseId);
      if (!mounted) return;
      setState(() {
        course = loaded;
        completed = done.contains(widget.lessonId);
        loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  Future<void> _markComplete() async {
    final messenger = ScaffoldMessenger.of(context);
    try {
      final certificateId = await CourseApiService.markLessonComplete(
          widget.courseId, widget.lessonId);
      if (!mounted) return;
      setState(() => completed = true);
      messenger.showSnackBar(SnackBar(
        content: Text(certificateId != null
            ? 'Course complete! Your certificate $certificateId has been issued.'
            : 'Lesson marked as complete'),
      ));
    } catch (_) {
      messenger.showSnackBar(const SnackBar(
        content: Text('Could not save your progress. Please try again.'),
      ));
    }
  }

  /// Opens a lesson link (playlist, form, tool) outside the app.
  Future<bool> _open(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null || !uri.hasScheme) return false;
    return launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final lesson = course?.lessonById(widget.lessonId);

    if (error != null || lesson == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Lesson')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  error != null
                      ? 'We could not load this lesson. Check your connection and try again.'
                      : 'This lesson could not be found.',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 16),
                if (error != null)
                  ElevatedButton(onPressed: _load, child: const Text('Retry')),
                TextButton(
                  onPressed: () => context.go('/course/${widget.courseId}'),
                  child: const Text('Back to course'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final next = course!.nextLesson(lesson.lessonId);

    return Scaffold(
      appBar: AppBar(
        title: Text(course!.title),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/course/${widget.courseId}'),
        ),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 760),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Text(
                'Lesson ${lesson.lessonOrder} of ${course!.lessons.length}'
                '${lesson.duration.isNotEmpty ? ' • ${lesson.duration}' : ''}',
                style: TextStyle(color: Colors.grey.shade600),
              ),
              if (lesson.videoUrl.isNotEmpty) ...[
                const SizedBox(height: 12),
                _LessonVideo(key: ValueKey(lesson.videoUrl), url: lesson.videoUrl),
              ],
              if (lesson.resourceUrl.isNotEmpty) ...[
                const SizedBox(height: 12),
                Card(
                  color: const Color(0xFFEFF5F1),
                  child: ListTile(
                    leading: const Icon(Icons.play_circle_fill,
                        color: Color(0xFF0B3D2E)),
                    title: Text(
                        lesson.resourceLabel.isNotEmpty
                            ? lesson.resourceLabel
                            : 'Open the learning material',
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                    trailing: const Icon(Icons.open_in_new),
                    onTap: () => _open(lesson.resourceUrl),
                  ),
                ),
              ],
              if (lesson.objective.isNotEmpty) ...[
                const SizedBox(height: 12),
                Card(
                  color: Colors.blue.shade50,
                  child: ListTile(
                    leading: const Icon(Icons.flag, color: Colors.blue),
                    title: const Text('Goal',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(lesson.objective),
                  ),
                ),
              ],
              const SizedBox(height: 8),
              HtmlWidget(
                // The reflection question is shown in its own card below,
                // so drop the inline copy some lessons include.
                lesson.reflectionQuestion.isEmpty
                    ? lesson.contentBody
                    : lesson.contentBody.replaceAll(
                        RegExp(r'<p>\s*<strong>\s*Reflection question:?\s*</strong>.*?</p>',
                            caseSensitive: false, dotAll: true),
                        ''),
                textStyle: const TextStyle(fontSize: 16, height: 1.5),
                onTapUrl: (url) => _open(url),
                // Prompts (<blockquote>) become copyable prompt cards.
                customWidgetBuilder: (element) => element.localName == 'blockquote'
                    ? _PromptCard(text: element.text.trim())
                    : null,
              ),
              if (lesson.assessmentUrl.isNotEmpty) ...[
                const SizedBox(height: 16),
                Card(
                  color: Colors.green.shade50,
                  child: ListTile(
                    leading: const Icon(Icons.fact_check, color: Colors.green),
                    title: const Text('Unit assessment',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: const Text(
                        'Check your understanding in the assessment form.'),
                    trailing: const Icon(Icons.open_in_new),
                    onTap: () => _open(lesson.assessmentUrl),
                  ),
                ),
              ],
              if (lesson.reflectionQuestion.isNotEmpty) ...[
                const SizedBox(height: 16),
                Card(
                  color: Colors.amber.shade50,
                  child: ListTile(
                    leading: const Icon(Icons.psychology, color: Colors.amber),
                    title: const Text('Think about it',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(lesson.reflectionQuestion),
                    trailing: IconButton(
                      tooltip: 'Discuss with the AI Tutor',
                      icon: const Icon(Icons.chat),
                      onPressed: () => context.push('/chat'),
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 24),
              if (completed)
                const ListTile(
                  leading: Icon(Icons.check_circle, color: Colors.green),
                  title: Text('You have completed this lesson'),
                )
              else
                ElevatedButton.icon(
                  onPressed: _markComplete,
                  icon: const Icon(Icons.check),
                  label: const Text('Mark lesson complete'),
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 50),
                  ),
                ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: () => context.go(next != null
                    ? '/course/${widget.courseId}/lesson/${next.lessonId}'
                    : '/course/${widget.courseId}'),
                icon: Icon(next != null ? Icons.arrow_forward : Icons.list),
                label: Text(next != null
                    ? 'Next: ${next.title}'
                    : 'Back to course overview'),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// A course prompt learners can copy into ChatGPT, Claude, Gemini or Copilot.
class _PromptCard extends StatelessWidget {
  final String text;

  const _PromptCard({required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFEFF5F1),
        borderRadius: BorderRadius.circular(12),
        border: const Border(
          left: BorderSide(color: Color(0xFFD1A054), width: 4),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(14, 10, 6, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.auto_awesome, size: 18, color: Color(0xFF0B3D2E)),
              const SizedBox(width: 6),
              const Expanded(
                child: Text(
                  'Prompt',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF0B3D2E),
                  ),
                ),
              ),
              TextButton.icon(
                onPressed: () async {
                  await Clipboard.setData(ClipboardData(text: text));
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Prompt copied')),
                    );
                  }
                },
                icon: const Icon(Icons.copy, size: 16),
                label: const Text('Copy'),
              ),
            ],
          ),
          const SizedBox(height: 4),
          SelectableText(
            text,
            style: const TextStyle(fontSize: 15, height: 1.5),
          ),
        ],
      ),
    );
  }
}

/// Lesson video (signed SharePoint URL) with standard playback controls.
class _LessonVideo extends StatefulWidget {
  final String url;

  const _LessonVideo({super.key, required this.url});

  @override
  State<_LessonVideo> createState() => _LessonVideoState();
}

class _LessonVideoState extends State<_LessonVideo> {
  late final VideoPlayerController _video;
  ChewieController? _chewie;
  bool _failed = false;

  @override
  void initState() {
    super.initState();
    _video = VideoPlayerController.networkUrl(Uri.parse(widget.url));
    _video.initialize().then((_) {
      if (!mounted) return;
      setState(() {
        _chewie = ChewieController(
          videoPlayerController: _video,
          autoPlay: false,
          looping: false,
          aspectRatio: _video.value.aspectRatio,
        );
      });
    }).catchError((_) {
      if (mounted) setState(() => _failed = true);
    });
  }

  @override
  void dispose() {
    _chewie?.dispose();
    _video.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: AspectRatio(
        aspectRatio: _chewie != null ? _video.value.aspectRatio : 16 / 9,
        child: Container(
          color: Colors.black,
          alignment: Alignment.center,
          child: _failed
              ? const Padding(
                  padding: EdgeInsets.all(16),
                  child: Text(
                    'This video could not be loaded. Go back and open the lesson again.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white70),
                  ),
                )
              : _chewie == null
                  ? const CircularProgressIndicator(color: Colors.white)
                  : Chewie(controller: _chewie!),
        ),
      ),
    );
  }
}
