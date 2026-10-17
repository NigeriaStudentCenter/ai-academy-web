import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/learner/learner_profile_service.dart';
import '../../core/theme/app_colors.dart';

/// First sign-in of a public learner: Teens or Professional sections.
class WelcomeTrackPage extends StatefulWidget {
  final String? redirectTo;
  const WelcomeTrackPage({super.key, this.redirectTo});

  @override
  State<WelcomeTrackPage> createState() => _WelcomeTrackPageState();
}

class _WelcomeTrackPageState extends State<WelcomeTrackPage> {
  bool _busy = false;

  Future<void> _choose(String track) async {
    setState(() => _busy = true);
    try {
      await LearnerProfileService.setTrack(track);
      if (mounted) context.go(widget.redirectTo ?? '/dashboard');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('We couldn\'t save that just now. Please try again.')));
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Widget _option(String track, IconData icon, String title, String text) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppColors.darkGreen, width: 1.5),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: _busy ? null : () => _choose(track),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Icon(icon, size: 40, color: AppColors.darkGreen),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(text, style: const TextStyle(color: Colors.black54)),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Welcome'), automaticallyImplyLeading: false),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 480),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text('Which best describes you?',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text('We\'ll show you the right courses. You can change this later in Account.',
                      textAlign: TextAlign.center),
                  const SizedBox(height: 24),
                  _option('teens', Icons.backpack_outlined, 'I\'m a student aged 13–17',
                      'AI Academy for Teens, the AI Tutor, and Cambridge and US curriculum practice.'),
                  const SizedBox(height: 12),
                  _option('professional', Icons.work_outline, 'I\'m an adult learner or professional',
                      'Practical AI courses for work and business, hubs and certificates.'),
                  if (_busy) ...[
                    const SizedBox(height: 20),
                    const Center(child: CircularProgressIndicator()),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
