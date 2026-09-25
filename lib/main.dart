import 'package:flutter/material.dart';
import 'package:flutter_web_plugins/url_strategy.dart';

import 'core/auth/entra_auth_service.dart';
import 'core/routing/app_router.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // ✅ THIS LINE IS CRITICAL
  // It removes #/ from Flutter Web URLs
  usePathUrlStrategy();

  // Restore the learner's Microsoft sign-in before the first route loads.
  await EntraAuthService.restoreSession();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      routerConfig: goRouter,
    );
  }
}