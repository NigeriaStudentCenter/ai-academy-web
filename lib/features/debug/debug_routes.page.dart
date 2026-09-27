import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Development builds only: shortcuts to screens that are hard to reach.
class DebugRoutesPage extends StatelessWidget {
  const DebugRoutesPage({super.key});

  static const _routes = {
    'Subscribe screen (plans preview)': '/subscribe?preview=1',
    'Create account': '/create-account',
    'Account': '/account',
    'Admin': '/admin',
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Debug')),
      body: ListView(
        children: [
          for (final e in _routes.entries)
            ListTile(
              title: Text(e.key),
              subtitle: Text(e.value),
              trailing: const Icon(Icons.arrow_forward),
              onTap: () => context.push(e.value),
            ),
        ],
      ),
    );
  }
}
