import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// ✅ Real Entra auth service
import '../../core/auth/entra_auth_service.dart';

class LoginPage extends StatelessWidget {
  final String? redirectTo;

  const LoginPage({
    super.key,
    this.redirectTo,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sign in')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.lock, size: 72),
              const SizedBox(height: 16),
              const Text(
                'Sign in to continue',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 24),

              // ✅ REAL MICROSOFT ENTRA LOGIN
              ElevatedButton.icon(
                icon: const Icon(Icons.login),
                label: const Text('Sign in with Microsoft'),
                onPressed: () async {
                  try {
                    await EntraAuthService.signIn(redirectTo);

                    // ✅ Redirect back to intended route
                    context.go(redirectTo ?? '/course/flutter-ai');
                  } catch (e) {
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'Sign-in failed: $e',
                          ),
                        ),
                      );
                    }
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
