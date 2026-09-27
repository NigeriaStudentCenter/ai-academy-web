import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;

import '../../core/api/api_client.dart';
import '../../core/theme/app_colors.dart';

/// Create an AI Academy account: the server sends a Microsoft invitation to
/// the learner's email; they accept it and then sign in with Microsoft.
class CreateAccountPage extends StatefulWidget {
  const CreateAccountPage({super.key});

  @override
  State<CreateAccountPage> createState() => _CreateAccountPageState();
}

class _CreateAccountPageState extends State<CreateAccountPage> {
  final _email = TextEditingController();
  final _name = TextEditingController();
  bool _sending = false;
  String? _error;
  String? _done;

  @override
  void dispose() {
    _email.dispose();
    _name.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final email = _email.text.trim();
    if (!RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]{2,}$').hasMatch(email)) {
      setState(() => _error = 'Enter a valid email address.');
      return;
    }
    setState(() {
      _sending = true;
      _error = null;
    });
    try {
      // No sign-in yet, so this call doesn't use ApiClient's token.
      final response = await http
          .post(Uri.parse('${ApiClient.baseUrl}/createAccount'),
              headers: {'Content-Type': 'application/json'},
              body: jsonEncode({'email': email, 'name': _name.text.trim()}))
          .timeout(const Duration(seconds: 45));
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      setState(() {
        if (response.statusCode == 200) {
          _done = json['message'] as String?;
        } else {
          _error = json['error'] as String? ??
              'Something went wrong (HTTP ${response.statusCode}).';
        }
      });
    } catch (e) {
      setState(() => _error = 'Could not reach AI Academy. Check your connection and try again.');
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkGreen,
      appBar: AppBar(
        backgroundColor: AppColors.darkGreen,
        foregroundColor: AppColors.nearWhite,
        elevation: 0,
        title: const Text('Create account'),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: ListView(
            padding: const EdgeInsets.all(24),
            shrinkWrap: true,
            children: [
              if (_done != null) ...[
                const Icon(Icons.mark_email_read,
                    color: AppColors.accentGold, size: 64),
                const SizedBox(height: 16),
                Text(_done!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                        color: AppColors.nearWhite, fontSize: 17, height: 1.4)),
                const SizedBox(height: 8),
                Text(
                  'The email comes from Microsoft on behalf of AI Academy. Check your junk folder if you can\'t see it.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      color: AppColors.nearWhite.withValues(alpha: 0.8)),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => context.go('/login'),
                  style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.nearWhite,
                      foregroundColor: AppColors.darkGreen),
                  child: const Text('Sign in with Microsoft'),
                ),
              ] else ...[
                const Text(
                  'Create your AI Academy account',
                  style: TextStyle(
                      color: AppColors.nearWhite,
                      fontSize: 22,
                      fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'We\'ll email you a Microsoft invitation. Accept it, then sign in with that email.',
                  style: TextStyle(
                      color: AppColors.nearWhite.withValues(alpha: 0.85)),
                ),
                const SizedBox(height: 20),
                _field(_name, 'Your name', TextInputType.name),
                const SizedBox(height: 12),
                _field(_email, 'Email address', TextInputType.emailAddress),
                if (_error != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 10),
                    child: Text(_error!,
                        style: const TextStyle(color: AppColors.accentGold)),
                  ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _sending ? null : _submit,
                  style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accentGold,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 50)),
                  child: _sending
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white))
                      : const Text('Send my invitation'),
                ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () => context.go('/login'),
                  child: const Text('I already have an account — sign in',
                      style: TextStyle(color: AppColors.nearWhite)),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _field(TextEditingController c, String label, TextInputType type) =>
      TextField(
        controller: c,
        keyboardType: type,
        autocorrect: false,
        style: const TextStyle(color: AppColors.darkGreen),
        onChanged: (_) {
          if (_error != null) setState(() => _error = null);
        },
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: AppColors.nearWhite,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
}
