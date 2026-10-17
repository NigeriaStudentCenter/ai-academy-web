import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/auth/entra_auth_service.dart';
import '../../core/auth/public_auth_service.dart';
import '../../core/learner/learner_profile_service.dart';
import '../../core/theme/app_colors.dart';

/// Sign in or create an account.
///
/// The public: Continue with Apple (iPhone/iPad) or Google — one tap — or
/// email + password. School and TeenSkills accounts: Sign in with Microsoft.
class LoginPage extends StatefulWidget {
  final String? redirectTo;

  const LoginPage({super.key, this.redirectTo});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool _busy = false;

  bool get _showApple =>
      !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.iOS ||
          defaultTargetPlatform == TargetPlatform.macOS);

  Future<void> _run(Future<void> Function() signIn) async {
    setState(() => _busy = true);
    try {
      await signIn();
      if (!mounted) return;
      await _continue();
    } catch (e) {
      final text = PublicAuthService.friendlyError(e);
      if (mounted && text.isNotEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  /// After sign-in: public learners choose Teens or Professional once, then
  /// carry on to where they were going.
  Future<void> _continue() async {
    final target = widget.redirectTo ?? '/dashboard';
    final needsTrack = await LearnerProfileService.needsTrack();
    if (!mounted) return;
    if (needsTrack) {
      context.go('/welcome-track?from=${Uri.encodeComponent(target)}');
    } else {
      context.go(target);
    }
  }

  Future<void> _microsoft() async {
    setState(() => _busy = true);
    try {
      await EntraAuthService.signIn(widget.redirectTo);
      // On the web the page has already gone to Microsoft; /oauth/callback finishes.
      if (kIsWeb) return;
      if (mounted) context.go(widget.redirectTo ?? '/dashboard');
    } catch (e) {
      debugPrint('Microsoft sign-in failed: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Microsoft sign-in didn\'t finish. Please try again.')));
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  void _email() {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (_) => _EmailSheet(onDone: () async {
        Navigator.of(context).pop();
        await _continue();
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sign in')),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Image.asset('assets/brand/app_icon.png', height: 72),
                  const SizedBox(height: 16),
                  const Text('Welcome to AI Academy',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  const Text('Sign in or create your account in one tap.',
                      textAlign: TextAlign.center),
                  const SizedBox(height: 28),
                  if (_showApple) ...[
                    _ProviderButton(
                      label: 'Continue with Apple',
                      icon: Icons.apple,
                      dark: true,
                      onPressed: _busy ? null : () => _run(PublicAuthService.signInWithApple),
                    ),
                    const SizedBox(height: 12),
                  ],
                  _ProviderButton(
                    label: 'Continue with Google',
                    icon: Icons.g_mobiledata,
                    onPressed: _busy ? null : () => _run(PublicAuthService.signInWithGoogle),
                  ),
                  const SizedBox(height: 12),
                  _ProviderButton(
                    label: 'Continue with email',
                    icon: Icons.mail_outline,
                    onPressed: _busy ? null : _email,
                  ),
                  if (_busy) ...[
                    const SizedBox(height: 20),
                    const Center(child: CircularProgressIndicator()),
                  ],
                  const SizedBox(height: 32),
                  const Divider(),
                  const SizedBox(height: 8),
                  const Text('School or TeenSkills account?',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.black54)),
                  TextButton.icon(
                    icon: const Icon(Icons.business),
                    label: const Text('Sign in with Microsoft'),
                    onPressed: _busy ? null : _microsoft,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ProviderButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool dark;
  final VoidCallback? onPressed;

  const _ProviderButton({required this.label, required this.icon, this.dark = false, this.onPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 52,
      child: dark
          ? FilledButton.icon(
              style: FilledButton.styleFrom(backgroundColor: Colors.black, foregroundColor: Colors.white),
              icon: Icon(icon, size: 26),
              label: Text(label, style: const TextStyle(fontSize: 16)),
              onPressed: onPressed,
            )
          : OutlinedButton.icon(
              style: OutlinedButton.styleFrom(foregroundColor: AppColors.darkGreen),
              icon: Icon(icon, size: 26),
              label: Text(label, style: const TextStyle(fontSize: 16)),
              onPressed: onPressed,
            ),
    );
  }
}

/// Email + password: sign in, create an account, or reset a password.
class _EmailSheet extends StatefulWidget {
  final Future<void> Function() onDone;
  const _EmailSheet({required this.onDone});

  @override
  State<_EmailSheet> createState() => _EmailSheetState();
}

class _EmailSheetState extends State<_EmailSheet> {
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _create = false;
  bool _busy = false;
  String? _message;

  Future<void> _submit() async {
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      if (_create) {
        await PublicAuthService.createWithEmail(_name.text, _email.text, _password.text);
      } else {
        await PublicAuthService.signInWithEmail(_email.text, _password.text);
      }
      await widget.onDone();
    } catch (e) {
      setState(() => _message = PublicAuthService.friendlyError(e));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _reset() async {
    if (_email.text.trim().isEmpty) {
      setState(() => _message = 'Enter your email above, then tap "Forgot password?" again.');
      return;
    }
    try {
      await PublicAuthService.sendPasswordReset(_email.text);
      setState(() => _message = 'We\'ve emailed you a link to reset your password.');
    } catch (e) {
      setState(() => _message = PublicAuthService.friendlyError(e));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(24, 0, 24, MediaQuery.of(context).viewInsets.bottom + 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(_create ? 'Create your account' : 'Sign in with email',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          if (_create) ...[
            TextField(
              controller: _name,
              textCapitalization: TextCapitalization.words,
              decoration: const InputDecoration(labelText: 'Your name', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 12),
          ],
          TextField(
            controller: _email,
            keyboardType: TextInputType.emailAddress,
            autocorrect: false,
            decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder()),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _password,
            obscureText: true,
            decoration: InputDecoration(
              labelText: _create ? 'Choose a password (6+ characters)' : 'Password',
              border: const OutlineInputBorder(),
            ),
            onSubmitted: (_) => _busy ? null : _submit(),
          ),
          if (_message != null) ...[
            const SizedBox(height: 12),
            Text(_message!, style: const TextStyle(color: Colors.redAccent)),
          ],
          const SizedBox(height: 16),
          SizedBox(
            height: 50,
            child: FilledButton(
              onPressed: _busy ? null : _submit,
              child: _busy
                  ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2))
                  : Text(_create ? 'Create account' : 'Sign in'),
            ),
          ),
          const SizedBox(height: 8),
          if (!_create)
            TextButton(onPressed: _reset, child: const Text('Forgot password?')),
          TextButton(
            onPressed: () => setState(() {
              _create = !_create;
              _message = null;
            }),
            child: Text(_create ? 'Already have an account? Sign in' : 'New here? Create an account'),
          ),
        ],
      ),
    );
  }
}
