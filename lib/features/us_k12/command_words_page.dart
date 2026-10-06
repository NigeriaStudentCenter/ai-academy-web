import 'package:flutter/material.dart';

import '../../core/k12/k12_service.dart';
import 'k12_widgets.dart';

/// Command word decoder: the command words used in this syllabus's exams,
/// with Cambridge's own meanings.
class CommandWordsPage extends StatelessWidget {
  final K12Syllabus syllabus;
  const CommandWordsPage({super.key, required this.syllabus});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Command words'),
        backgroundColor: k12Blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        children: [
          Text('${syllabus.qualification} ${syllabus.name} (${syllabus.code})',
              style: const TextStyle(fontWeight: FontWeight.w700, color: k12Blue)),
          const SizedBox(height: 6),
          const Text(
            'Exam questions start with a command word that tells you exactly what to do. '
            'These are the words used in this syllabus, with Cambridge’s own meanings.',
            style: TextStyle(height: 1.4),
          ),
          const SizedBox(height: 12),
          for (final w in syllabus.commandWords)
            Card(
              margin: const EdgeInsets.only(bottom: 8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              child: ListTile(
                title: Text(w.word, style: const TextStyle(fontWeight: FontWeight.w700)),
                subtitle: Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: Text(w.meaning, style: const TextStyle(height: 1.35)),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
