import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// ===============================
// FEATURE IMPORTS
// ===============================
import '../../features/admin/admin_dashboard.page.dart';
import '../../features/certificates/subject_certificate.page.dart';
import '../../features/courses/course_detail_page.dart';
import '../../features/courses/lesson_player.page.dart';
import '../../features/courses/ai_notes.page.dart';
import '../../features/courses/video_player.page.dart';
import '../../features/chat/ai_chat.page.dart';
import '../../features/curriculum/curriculum_selector.page.dart';
import '../../features/progress/progress_dashboard.page.dart';
import '../../features/debug/debug_routes.page.dart';
import '../../features/common/not_found_page.dart';
import '../../features/auth/login_page.dart';

// ===============================
// CORE AUTH STATE (ENTRA-READY)
// ===============================
import '../../core/auth/app_auth_state.dart';

// ===============================
// ✅ FINAL GOROUTER CONFIGURATION
// ===============================
final GoRouter goRouter = GoRouter(
  initialLocation: '/course/flutter-ai',

  // ===============================
  // 🔐 AUTH + ROLE REDIRECT LOGIC
  // ===============================
  redirect: (context, state) {
    final location = state.matchedLocation;
    final isLoggedIn = AppAuthState.isLoggedIn;
    final isLoggingIn = location == '/login';

    // Pages that require authentication
    final requiresAuth =
        location.startsWith('/course') || location.startsWith('/admin');

    // 🚫 Not logged in → redirect to login, preserve target
    if (!isLoggedIn && requiresAuth && !isLoggingIn) {
      return '/login?from=$location';
    }

    // ✅ Logged in but visiting /login → go home
    if (isLoggedIn && isLoggingIn) {
      return '/course/flutter-ai';
    }

    // 🔐 ADMIN ROLE PROTECTION (ENTRA-BASED)
    if (location.startsWith('/admin') && !AppAuthState.isAdmin) {
      return '/course/flutter-ai';
    }

    return null;
  },

  // ===============================
  // 🧭 404 HANDLER
  // ===============================
  errorBuilder: (context, state) {
    return const NotFoundPage();
  },

  routes: [
    // -------------------------------
    // LOGIN
    // -------------------------------
    GoRoute(
      path: '/login',
      builder: (context, state) {
        final redirectTo = state.uri.queryParameters['from'];
        return LoginPage(redirectTo: redirectTo);
      },
    ),

    // -------------------------------
    // COURSES (WITH DEEP LINKS)
    // -------------------------------
    GoRoute(
      path: '/course/:courseId',
      builder: (context, state) {
        final courseId = state.pathParameters['courseId']!;
        return CourseDetailPage(courseId: courseId);
      },
      routes: [
        GoRoute(
          path: 'lesson/:lessonId',
          builder: (context, state) {
            final courseId = state.pathParameters['courseId']!;
            final lessonId = state.pathParameters['lessonId']!;
            return LessonPlayerPage(
              courseId: courseId,
              lessonId: lessonId,
            );
          },
        ),
      ],
    ),

    // -------------------------------
    // NOTES / VIDEO
    // -------------------------------
    GoRoute(
      path: '/notes',
      builder: (context, state) => const AINotesPage(),
    ),

    GoRoute(
      path: '/video',
      builder: (context, state) => const VideoPlayerPage(),
    ),

    // -------------------------------
    // CHAT / CURRICULUM / PROGRESS
    // -------------------------------
    GoRoute(
      path: '/chat',
      builder: (context, state) => const AIChatPage(),
    ),

    GoRoute(
      path: '/curriculum',
      builder: (context, state) => const CurriculumSelectorPage(),
    ),

    GoRoute(
      path: '/progress',
      builder: (context, state) => const ProgressDashboardPage(),
    ),

    // -------------------------------
    // CERTIFICATE
    // -------------------------------
    GoRoute(
      path: '/certificate',
      builder: (context, state) => const SubjectCertificatePage(),
    ),

    // -------------------------------
    // ADMIN (AUTH + ROLE GUARDED)
    // -------------------------------
    GoRoute(
      path: '/admin',
      builder: (context, state) => const AdminDashboardPage(),
    ),

    // -------------------------------
    // DEBUG
    // -------------------------------
    GoRoute(
      path: '/debug',
      builder: (context, state) => const DebugRoutesPage(),
    ),
  ],
);