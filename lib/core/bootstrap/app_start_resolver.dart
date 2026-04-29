import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../services/curriculum_state_service.dart';

class AppStartResolver extends StatefulWidget {
  const AppStartResolver({super.key});

  @override
  State<AppStartResolver> createState() => _AppStartResolverState();
}

class _AppStartResolverState extends State<AppStartResolver> {
  @override
  void initState() {
    super.initState();
    _decideStart();
  }

  Future<void> _decideStart() async {
    final saved =
        await CurriculumStateService.loadSelection();

    if (saved != null) {
      Get.offAllNamed("/chat", arguments: saved);
    } else {
      Get.offAllNamed("/curriculum");
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}