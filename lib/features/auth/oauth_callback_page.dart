import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/auth/entra_auth_service.dart';

/// Web only: Microsoft redirects here with ?code=...; exchange it for tokens
/// and continue to where the learner was going.
class OAuthCallbackPage extends StatefulWidget {
  final Uri uri;

  const OAuthCallbackPage({super.key, required this.uri});

  @override
  State<OAuthCallbackPage> createState() => _OAuthCallbackPageState();
}

class _OAuthCallbackPageState extends State<OAuthCallbackPage> {
  String? error;

  @override
  void initState() {
    super.initState();
    _complete();
  }

  Future<void> _complete() async {
    try {
      final redirectAfter = await EntraAuthService.completeWebRedirect(widget.uri);
      if (!mounted) return;
      context.go(redirectAfter ?? '/dashboard');
    } catch (e) {
      if (!mounted) return;
      setState(() => error = e.toString().replaceFirst('Exception: ', ''));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: error == null
            ? const Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Signing you in…'),
                ],
              )
            : Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.error_outline, size: 48, color: Colors.red),
                    const SizedBox(height: 12),
                    Text('Sign-in did not complete.\n$error',
                        textAlign: TextAlign.center),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () => context.go('/login'),
                      child: const Text('Try again'),
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}
