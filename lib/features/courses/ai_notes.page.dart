import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:pdf/pdf.dart';
import 'package:printing/printing.dart';

import '../../services/ai_tutor_service.dart';
import '../../services/notes_storage_service.dart';

// ✅ Step 5B: Drawer navigation so routes are always reachable
import '../../widgets/app_nav_drawer.dart';

enum NotesMode {
  fullStructured,
  shortSummary,
  examPrep,
  bulletOnly,
}

extension NotesModeX on NotesMode {
  String get label {
    switch (this) {
      case NotesMode.fullStructured:
        return "Full";
      case NotesMode.shortSummary:
        return "Short";
      case NotesMode.examPrep:
        return "Exam";
      case NotesMode.bulletOnly:
        return "Bullets";
    }
  }

  String get storageValue {
    switch (this) {
      case NotesMode.fullStructured:
        return "full";
      case NotesMode.shortSummary:
        return "short";
      case NotesMode.examPrep:
        return "exam";
      case NotesMode.bulletOnly:
        return "bullets";
    }
  }
}

class AINotesPage extends StatefulWidget {
  const AINotesPage({super.key});

  @override
  State<AINotesPage> createState() => _AINotesPageState();
}

class _AINotesPageState extends State<AINotesPage> {
  bool isLoading = false;
  String notes = "";
  String error = "";
  String lastSavedInfo = "";

  NotesMode mode = NotesMode.fullStructured;

  String get _topic {
    final args = Get.arguments;
    if (args is String && args.trim().isNotEmpty) return args.trim();
    return "AI Basics";
  }

  @override
  void initState() {
    super.initState();
    _loadSavedIfAny();
  }

  Future<void> _loadSavedIfAny() async {
    final saved = await NotesStorageService.loadNotes(_topic);
    if (saved == null) return;

    final savedNotes = saved["notes"];
    final savedMode = saved["mode"];
    final updatedAt = saved["updatedAt"];

    if (savedNotes is String && savedNotes.trim().isNotEmpty) {
      setState(() {
        notes = savedNotes;
        lastSavedInfo = _formatSavedInfo(updatedAt);
        mode = _modeFromStorage(savedMode);
      });
    }
  }

  NotesMode _modeFromStorage(dynamic value) {
    final v = (value ?? "").toString().toLowerCase().trim();
    switch (v) {
      case "short":
        return NotesMode.shortSummary;
      case "exam":
        return NotesMode.examPrep;
      case "bullets":
        return NotesMode.bulletOnly;
      case "full":
      default:
        return NotesMode.fullStructured;
    }
  }

  String _formatSavedInfo(dynamic updatedAt) {
    if (updatedAt is String && updatedAt.isNotEmpty) {
      // Keep it simple, readable, and stable
      return "Saved: $updatedAt";
    }
    return "Saved";
  }

  /// Builds the prompt depending on mode.
  /// We still use generateStructuredNotes() for the default Full mode.
  Future<String> _generateByMode(String topic) async {
    switch (mode) {
      case NotesMode.fullStructured:
        return AITutorService.generateStructuredNotes(topic);

      case NotesMode.shortSummary:
        return AITutorService.sendMessage("""
You are an expert study tutor.

Create SHORT study notes for the topic below.

Rules:
- Very short sections
- Simple English
- 6 to 10 bullet points total
- End with 3 quick revision questions

Topic:
$topic
""");

      case NotesMode.examPrep:
        return AITutorService.sendMessage("""
You are an exam preparation tutor.

Create exam-ready notes for the topic below.

Rules:
- Clear headings
- Key definitions
- Common exam questions
- Model answers (short)
- Common mistakes
- Exam tips
- End with a 5-question quiz (with answers)

Topic:
$topic
""");

      case NotesMode.bulletOnly:
        return AITutorService.sendMessage("""
You are a study tutor.

Create BULLET-ONLY notes for the topic below.

Rules:
- No paragraphs
- Only bullet points
- Simple English
- Keep it clear and structured with headings

Topic:
$topic
""");
    }
  }

  Future<void> generateNotes() async {
    if (isLoading) return;

    setState(() {
      isLoading = true;
      error = "";
      notes = "";
      lastSavedInfo = "";
    });

    try {
      final result = await _generateByMode(_topic);

      setState(() {
        notes = result;
      });

      // ✅ Auto-save per topic + selected mode
      await NotesStorageService.saveNotes(
        topic: _topic,
        mode: mode.storageValue,
        notes: result,
      );

      setState(() {
        lastSavedInfo = "Saved now";
      });
    } catch (e) {
      setState(() {
        error = "Failed to generate notes.\n\n$e";
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  /// Regenerate is just generateNotes() with current mode.
  Future<void> regenerateNotes() async {
    await generateNotes();
  }

  Future<void> copyNotes() async {
    if (notes.trim().isEmpty) return;

    await Clipboard.setData(ClipboardData(text: notes));

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Notes copied to clipboard.")),
    );
  }

  Future<void> deleteSavedNotes() async {
    await NotesStorageService.deleteNotes(_topic);

    setState(() {
      notes = "";
      error = "";
      lastSavedInfo = "";
    });

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Saved notes deleted.")),
    );
  }

  // ✅ FINAL, STABLE, UNICODE-SAFE PDF EXPORT
  Future<void> exportPdf() async {
    if (notes.trim().isEmpty) return;

    final pdf = pw.Document();
    final topic = _topic;

    // PdfGoogleFonts comes from printing
    final regularFont = await PdfGoogleFonts.notoSansRegular();
    final boldFont = await PdfGoogleFonts.notoSansBold();

    // Safer filename for iOS/macOS (remove illegal characters)
    final safeTitle = topic.replaceAll(RegExp(r'[\\/:*?"<>|]'), "_");

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (context) => [
          pw.Text(
            "$topic (${mode.label})",
            style: pw.TextStyle(
              font: boldFont,
              fontSize: 22,
            ),
          ),
          pw.SizedBox(height: 16),
          pw.Text(
            notes,
            style: pw.TextStyle(
              font: regularFont,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );

    final bytes = await pdf.save();

    await Printing.sharePdf(
      bytes: bytes,
      filename: "$safeTitle-${mode.label}.pdf",
    );
  }

  @override
  Widget build(BuildContext context) {
    final topic = _topic;

    return Scaffold(
      // ✅ Step 5B: Drawer available on Notes page too
    drawer: AppNavDrawer(),

      appBar: AppBar(
        title: const Text("AI Study Notes"),
        actions: [
          // ✅ Quick return to Course (useful when testing routes)
          IconButton(
            tooltip: "Back to Course",
            icon: const Icon(Icons.home),
            onPressed: () => Get.offAllNamed("/course"),
          ),

          if (notes.isNotEmpty)
            IconButton(
              tooltip: "Copy notes",
              icon: const Icon(Icons.copy),
              onPressed: copyNotes,
            ),
          if (notes.isNotEmpty)
            IconButton(
              tooltip: "Export PDF",
              icon: const Icon(Icons.picture_as_pdf),
              onPressed: exportPdf,
            ),
          PopupMenuButton<String>(
            tooltip: "More",
            onSelected: (value) async {
              if (value == "delete") {
                await deleteSavedNotes();
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: "delete",
                child: Text("Delete saved notes"),
              ),
            ],
          ),
        ],
      ),

      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              topic,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 8),

            if (lastSavedInfo.isNotEmpty)
              Text(
                lastSavedInfo,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey.shade700,
                ),
              ),

            const SizedBox(height: 12),

            // ✅ Mode selector
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: NotesMode.values.map((m) {
                final selected = m == mode;
                return ChoiceChip(
                  label: Text(m.label),
                  selected: selected,
                  onSelected: isLoading
                      ? null
                      : (_) {
                          setState(() => mode = m);
                        },
                );
              }).toList(),
            ),

            const SizedBox(height: 16),

            Row(
              children: [
                ElevatedButton.icon(
                  onPressed: isLoading ? null : generateNotes,
                  icon: const Icon(Icons.description),
                  label: const Text("Generate Notes"),
                ),
                const SizedBox(width: 12),
                OutlinedButton.icon(
                  onPressed: (isLoading || notes.isEmpty) ? null : regenerateNotes,
                  icon: const Icon(Icons.refresh),
                  label: const Text("Regenerate"),
                ),
              ],
            ),

            const SizedBox(height: 16),

            if (isLoading) ...[
              const LinearProgressIndicator(),
              const SizedBox(height: 12),
              const Center(child: Text("Generating notes...")),
              const SizedBox(height: 12),
            ],

            if (!isLoading && error.isNotEmpty) ...[
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Text(
                  error,
                  style: const TextStyle(color: Colors.red),
                ),
              ),
              const SizedBox(height: 12),
            ],

            if (!isLoading && error.isEmpty && notes.isNotEmpty)
              Expanded(
                child: SingleChildScrollView(
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: SelectableText(
                      notes,
                      style: const TextStyle(
                        fontSize: 16,
                        height: 1.5,
                      ),
                    ),
                  ),
                ),
              ),

            if (!isLoading && error.isEmpty && notes.isEmpty)
              const Expanded(
                child: Center(
                  child: Text(
                    "Tap “Generate Notes” to create AI notes for this topic.\n\nYour notes will auto-save for this topic.",
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}