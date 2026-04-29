import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:printing/printing.dart';
import 'package:pdf/widgets.dart' as pw;

class SubjectCertificatePage extends StatelessWidget {
  const SubjectCertificatePage({super.key});

  @override
  Widget build(BuildContext context) {
    final args = Get.arguments as Map<String, dynamic>? ?? {};

    final subject = args["subject"] ?? "Subject";
    final track = args["track"] ?? "";
    final program = args["program"] ?? "";
    final completedOnRaw = args["completedOn"];

    final completedOn = completedOnRaw != null
        ? DateTime.tryParse(completedOnRaw)?.toLocal()
        : null;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Completion Certificate"),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Card(
            elevation: 4,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.verified,
                    size: 64,
                    color: Colors.green,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    "Certificate of Completion",
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text("This certifies that"),
                  const SizedBox(height: 8),
                  const Text(
                    "Self‑learning student",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text("has completed the subject"),
                  const SizedBox(height: 8),
                  Text(
                    subject,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    "$track • $program",
                    style: TextStyle(color: Colors.grey.shade600),
                  ),
                  const SizedBox(height: 16),
                  if (completedOn != null)
                    Text(
                      "Completed on ${completedOn.day}/${completedOn.month}/${completedOn.year}",
                      style: const TextStyle(fontSize: 12),
                    ),
                  const SizedBox(height: 24),
                  const Text(
                    "This learning was completed with guided AI support.\nYou may revisit or revise any topic at any time.",
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.black54),
                  ),
                  const SizedBox(height: 32),

                  // ✅ C1.2 — Download PDF
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.download),
                      label:
                          const Text("Download PDF Certificate"),
                      onPressed: () {
                        _downloadPdf(
                          subject: subject,
                          track: track,
                          program: program,
                          completedOn: completedOn,
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 12),

                  // ✅ C1.3 — Copy shareable summary
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.share),
                      label: const Text(
                          "Copy Shareable Summary"),
                      onPressed: () {
                        _copySummary(
                          context,
                          subject: subject,
                          track: track,
                          program: program,
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ✅ PDF generation logic (unchanged)
  static Future<void> _downloadPdf({
    required String subject,
    required String track,
    required String program,
    DateTime? completedOn,
  }) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        margin: const pw.EdgeInsets.all(40),
        build: (context) {
          return pw.Column(
            mainAxisAlignment: pw.MainAxisAlignment.center,
            crossAxisAlignment:
                pw.CrossAxisAlignment.center,
            children: [
              pw.Text(
                "Certificate of Completion",
                style: pw.TextStyle(
                  fontSize: 28,
                  fontWeight: pw.FontWeight.bold,
                ),
              ),
              pw.SizedBox(height: 24),
              pw.Text("This certifies that"),
              pw.SizedBox(height: 8),
              pw.Text(
                "Self‑learning student",
                style: pw.TextStyle(
                  fontSize: 18,
                  fontWeight: pw.FontWeight.bold,
                ),
              ),
              pw.SizedBox(height: 24),
              pw.Text(
                  "has successfully completed the subject"),
              pw.SizedBox(height: 12),
              pw.Text(
                subject,
                style: pw.TextStyle(
                  fontSize: 22,
                  fontWeight: pw.FontWeight.bold,
                ),
                textAlign: pw.TextAlign.center,
              ),
              pw.SizedBox(height: 16),
              pw.Text("$track • $program"),
              pw.SizedBox(height: 16),
              if (completedOn != null)
                pw.Text(
                  "Completed on ${completedOn.day}/${completedOn.month}/${completedOn.year}",
                  style:
                      const pw.TextStyle(fontSize: 10),
                ),
              pw.SizedBox(height: 32),
              pw.Text(
                "This learning was completed with guided AI support.",
                textAlign: pw.TextAlign.center,
              ),
            ],
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (_) async => pdf.save(),
    );
  }

  // ✅ C1.3 — Shareable text summary
  static void _copySummary(
    BuildContext context, {
    required String subject,
    required String track,
    required String program,
  }) {
    final summary = """
✅ Learning completed

I have completed the subject "$subject"
using guided AI learning support.

Track: $track
Program: $program

I can confidently explain the core ideas
and continue learning independently.
""";

    Clipboard.setData(
      ClipboardData(text: summary.trim()),
    );

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("✅ Summary copied to clipboard"),
      ),
    );
  }
}