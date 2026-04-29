
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class DebugRoutesPage extends StatelessWidget {
  const DebugRoutesPage({super.key});

  @override
  Widget build(BuildContext context) {
    final routes = Get.routeTree.routes.map((r) => r.name).toList();

    return Scaffold(
      appBar: AppBar(title: const Text("Debug Routes")),
      body: ListView.separated(
        itemCount: routes.length,
        separatorBuilder: (_, __) => const Divider(height: 1),
        itemBuilder: (context, index) {
          final name = routes[index];
          return ListTile(
            title: Text(name),
            trailing: const Icon(Icons.arrow_forward),
            onTap: () {
              if (name == "/notes") {
                Get.toNamed("/notes", arguments: "AI Basics");
                return;
              }
              if (name == "/chat") {
                Get.toNamed("/chat", arguments: {
                  "track": "Academic",
                  "program": "General",
                  "subject": "AI",
                  "topic": "AI Basics",
                });
                return;
              }
              Get.toNamed(name);
            },
          );
        },
      ),
    );
  }
}
