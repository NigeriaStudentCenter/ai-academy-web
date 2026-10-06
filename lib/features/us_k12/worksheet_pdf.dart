import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

import '../../core/k12/k12_service.dart';

/// Replaces characters the built-in PDF font can't draw — used only when
/// the Noto Sans download fails.
String _latin1(String s) => s
    .replaceAll(RegExp('[‘’]'), "'")
    .replaceAll(RegExp('[“”]'), '"')
    .replaceAll(RegExp('[–—−]'), '-')
    .replaceAll('…', '...')
    .replaceAll('≤', '<=')
    .replaceAll('≥', '>=')
    .replaceAll('≠', '!=')
    .replaceAll('√', 'sqrt')
    .replaceAll('π', 'pi')
    .replaceAll(RegExp(r'[^\x00-\xFF]'), '');

/// Emoji and other symbols Noto Sans doesn't have.
String _clean(String s) => s.replaceAll(RegExp(r'[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]', unicode: true), '');

/// Builds a printable worksheet (questions, then an answer key on a new
/// page) and opens the system print / save-as-PDF sheet.
Future<void> printWorksheet(K12Quiz quiz, {String focus = ''}) async {
  pw.ThemeData? theme;
  var text = _clean;
  try {
    theme = pw.ThemeData.withFont(
      base: await PdfGoogleFonts.notoSansRegular(),
      bold: await PdfGoogleFonts.notoSansBold(),
    );
  } catch (_) {
    text = (s) => _latin1(_clean(s));
  }

  const blue = PdfColor.fromInt(0xFF1F3A93);
  const grey = PdfColor.fromInt(0xFF666666);
  final title = focus.isNotEmpty ? focus : quiz.skillName;
  final letters = ['A', 'B', 'C', 'D'];
  final codes = {for (final q in quiz.questions) q.code}.toList();

  pw.Widget header() => pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
        pw.Row(children: [
          pw.Expanded(child: pw.Text('Name: ______________________________')),
          pw.Text('Date: _______________'),
        ]),
        pw.SizedBox(height: 14),
        pw.Text(text(title), style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold, color: blue)),
        pw.SizedBox(height: 4),
        pw.Text(text('${quiz.grade} ${quiz.subject} · ${quiz.domain} · ${quiz.tier}'),
            style: const pw.TextStyle(fontSize: 10, color: grey)),
        pw.Text(text('Aligned to: ${codes.join('; ')}'), style: const pw.TextStyle(fontSize: 9, color: grey)),
        pw.Text(text('${quiz.state}: ${quiz.stateFramework}'), style: const pw.TextStyle(fontSize: 9, color: grey)),
        pw.Divider(color: blue),
      ]);

  final pdf = pw.Document(theme: theme, title: text('Worksheet - $title'), author: 'AI Academy');
  pdf.addPage(pw.MultiPage(
    pageFormat: PdfPageFormat.letter,
    margin: const pw.EdgeInsets.all(40),
    header: (c) => c.pageNumber == 1 ? header() : pw.SizedBox(),
    footer: (c) => pw.Align(
      alignment: pw.Alignment.centerRight,
      child: pw.Text('AI Academy · Curriculum Tutor · page ${c.pageNumber}',
          style: const pw.TextStyle(fontSize: 8, color: grey)),
    ),
    build: (c) => [
      for (var i = 0; i < quiz.questions.length; i++)
        pw.Padding(
          padding: const pw.EdgeInsets.only(bottom: 14),
          child: pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
            pw.Text(text('${i + 1}. ${quiz.questions[i].question}'), style: const pw.TextStyle(fontSize: 12, lineSpacing: 2)),
            pw.SizedBox(height: 6),
            if (quiz.questions[i].isChoice)
              for (var o = 0; o < quiz.questions[i].options.length; o++)
                pw.Padding(
                  padding: const pw.EdgeInsets.only(left: 14, bottom: 3),
                  child: pw.Text(text('(${letters[o]})  ${quiz.questions[i].options[o]}'), style: const pw.TextStyle(fontSize: 11.5)),
                )
            else
              for (var line = 0; line < 3; line++)
                pw.Container(
                  margin: const pw.EdgeInsets.only(top: 16, left: 14),
                  decoration: const pw.BoxDecoration(border: pw.Border(bottom: pw.BorderSide(color: grey, width: 0.5))),
                ),
          ]),
        ),
      pw.NewPage(),
      pw.Text('Answer key', style: pw.TextStyle(fontSize: 16, fontWeight: pw.FontWeight.bold, color: blue)),
      pw.Text(text('For the parent or teacher — $title'), style: const pw.TextStyle(fontSize: 10, color: grey)),
      pw.SizedBox(height: 10),
      for (var i = 0; i < quiz.questions.length; i++)
        pw.Padding(
          padding: const pw.EdgeInsets.only(bottom: 9),
          child: pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
            pw.Text(
                text('${i + 1}. ${quiz.questions[i].isChoice ? '(${letters[quiz.questions[i].answerIndex]}) ' : ''}${quiz.questions[i].answerText}'),
                style: pw.TextStyle(fontSize: 11.5, fontWeight: pw.FontWeight.bold)),
            if (quiz.questions[i].explanation.isNotEmpty)
              pw.Text(text(quiz.questions[i].explanation), style: const pw.TextStyle(fontSize: 10.5)),
            pw.Text(text(quiz.state == 'Cambridge International' ? quiz.questions[i].code : 'DOK ${quiz.questions[i].dok} (${quiz.questions[i].dokLabel}) · ${quiz.questions[i].code}'),
                style: const pw.TextStyle(fontSize: 8.5, color: grey)),
          ]),
        ),
    ],
  ));

  await Printing.layoutPdf(name: 'Worksheet - ${_latin1(title)}', onLayout: (_) => pdf.save());
}
