import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:markdown/markdown.dart' as md;

/// US K–12 accent colours.
const k12Blue = Color(0xFF1F3A93);
const k12Red = Color(0xFFB22234);
const k12Soft = Color(0xFFF1F3FA);

const subjectIcons = {
  'math': Icons.calculate_outlined,
  'ela': Icons.menu_book_outlined,
  'science': Icons.science_outlined,
  'social': Icons.public,
};

/// "practising" / "mastered" / "struggling" (or nothing for not started).
class StatusChip extends StatelessWidget {
  final String status;
  final bool dense;
  const StatusChip(this.status, {super.key, this.dense = false});

  @override
  Widget build(BuildContext context) {
    final (label, color, icon) = switch (status) {
      'mastered' => ('Mastered', const Color(0xFF1B7F3B), Icons.star_rounded),
      'struggling' => ('Needs review', const Color(0xFFC0392B), Icons.flag_rounded),
      'practising' => ('Practicing', const Color(0xFFB7791F), Icons.timelapse_rounded),
      _ => ('Not started', Colors.black45, Icons.circle_outlined),
    };
    return Container(
      padding: EdgeInsets.symmetric(horizontal: dense ? 6 : 8, vertical: dense ? 2 : 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, size: dense ? 13 : 15, color: color),
        const SizedBox(width: 4),
        Text(label,
            style: TextStyle(fontSize: dense ? 11 : 12, color: color, fontWeight: FontWeight.w600)),
      ]),
    );
  }
}

/// Official standard codes (e.g. CCSS.MATH.CONTENT.5.NF.A.1).
class CodeChips extends StatelessWidget {
  final List<String> codes;
  final Color color;
  const CodeChips(this.codes, {super.key, this.color = k12Blue});

  @override
  Widget build(BuildContext context) => Wrap(
        spacing: 6,
        runSpacing: 6,
        children: [
          for (final c in codes)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                border: Border.all(color: color.withValues(alpha: 0.35)),
                borderRadius: BorderRadius.circular(6),
              ),
              child: SelectableText(c,
                  style: TextStyle(
                      fontSize: 11.5, fontFamily: 'monospace', color: color)),
            ),
        ],
      );
}

class MarkdownText extends StatelessWidget {
  final String text;
  final double fontSize;
  const MarkdownText(this.text, {super.key, this.fontSize = 15});

  @override
  Widget build(BuildContext context) => HtmlWidget(
        md.markdownToHtml(text, extensionSet: md.ExtensionSet.gitHubFlavored),
        textStyle: TextStyle(fontSize: fontSize, height: 1.45),
      );
}

class ErrorRetry extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;
  const ErrorRetry(this.message, this.onRetry, {super.key});

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 12),
            FilledButton(
                style: FilledButton.styleFrom(backgroundColor: k12Blue),
                onPressed: onRetry,
                child: const Text('Try again')),
          ]),
        ),
      );
}

String errorText(Object e) => e.toString().replaceFirst('Exception: ', '');
