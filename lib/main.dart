import 'package:flutter/material.dart';
import 'package:flutter_web_plugins/url_strategy.dart';

import 'dart:async';

import 'package:firebase_core/firebase_core.dart';

import 'core/api/api_client.dart';
import 'core/auth/app_auth_state.dart';
import 'core/auth/entra_auth_service.dart';
import 'core/auth/public_auth_service.dart';
import 'core/learner/learner_profile_service.dart';
import 'core/routing/app_router.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // ✅ THIS LINE IS CRITICAL
  // It removes #/ from Flutter Web URLs
  usePathUrlStrategy();

  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  // Restore the learner's sign-in before the first route loads: Microsoft
  // (school / TeenSkills accounts) or Firebase (Google, Apple, email).
  await EntraAuthService.restoreSession();
  if (!AppAuthState.isLoggedIn) {
    await PublicAuthService.restoreSession();
    // Public learners: load their Teens / Professional choice in the background.
    if (AppAuthState.isLoggedIn) unawaited(LearnerProfileService.needsTrack());
  }

  // Anything that needs the All Access subscription opens the subscribe screen.
  ApiClient.onSubscriptionRequired = () {
    final here = goRouter.routerDelegate.currentConfiguration.uri.path;
    if (here != '/subscribe') goRouter.push('/subscribe');
  };

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