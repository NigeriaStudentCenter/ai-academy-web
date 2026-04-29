import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../widgets/app_nav_drawer.dart';

class NotFoundPage extends StatelessWidget {
  const NotFoundPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AppNavDrawer(),
      appBar: AppBar(
        title: const Text('Page not found'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.search_off,
                size: 72,
                color: Colors.grey,
              ),
              const SizedBox(height: 16),
              const Text(
                '404',
                style: TextStyle(
                  fontSize: 48,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Sorry, the page you are looking for does not exist.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () {
                  context.go('/course/flutter-ai');
                },
                icon: const Icon(Icons.home),
                label: const Text('Go to courses'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}