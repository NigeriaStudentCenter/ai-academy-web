import 'package:flutter/foundation.dart';
import 'package:go_router/go_router.dart';

// ===============================
// FEATURE IMPORTS
// ===============================
import '../../features/admin/admin_dashboard.page.dart';
import '../../features/auth/login_page.dart';
import '../../features/auth/oauth_callback_page.dart';
import '../../features/certificates/certificate_verification_page.dart';
import '../../features/certificates/subject_certificate.page.dart';
import '../../features/command_center/command_center_page.dart';
import '../../features/student_hub/student_hub_page.dart';
import '../../features/chat/ai_chat.page.dart';
import '../../features/common/not_found_page.dart';
import '../../features/courses/ai_notes.page.dart';
import '../../features/courses/course_detail_page.dart';
import '../../features/courses/course_list_page.dart';
import '../../features/courses/lesson_player.page.dart';
import '../../features/courses/video_player.page.dart';
import '../../features/curriculum/curriculum_selector.page.dart';
import '../../features/dashboard/dashboard_page.dart';
import '../../features/debug/debug_routes.page.dart';
import '../../features/home/landing_page.dart';
import '../../features/progress/progress_dashboard.page.dart';

// ===============================
// CORE AUTH STATE
// ===============================
import '../../core/auth/app_auth_state.dart';

// ===============================
// APP ROUTER
// ===============================
final GoRouter goRouter = GoRouter(
  initialLocation: '/',

  redirect: (context, state) {
    final location = state.matchedLocation;
    final isLoggedIn = AppAuthState.isLoggedIn;
    final isLoggingIn = location == '/login';

    // ✅ Everything needs a signed-in learner except these public pages
    final isPublic = location == '/' ||
        isLoggingIn ||
        location == '/oauth/callback' ||
        location.startsWith('/verify/');
    final requiresAuth = !isPublic;

    // 🚫 Not logged in → redirect to login with return target
    if (!isLoggedIn && requiresAuth && !isLoggingIn) {
      return '/login?from=${Uri.encodeComponent(location)}';
    }

    // ✅ Logged-in user visiting /login → dashboard
    if (isLoggedIn && isLoggingIn) {
      return '/dashboard';
    }

    // 🔐 Admin route protection
    if (location.startsWith('/admin') && !AppAuthState.isAdmin) {
      return '/dashboard';
    }

    return null;
  },

  errorBuilder: (context, state) => const NotFoundPage(),

  routes: [
    // -------------------------------
    // Public landing page
    // -------------------------------
    GoRoute(
      path: '/',
      redirect: (context, state) {
        if (AppAuthState.isLoggedIn) {
          return '/dashboard';
        }
        return null;
      },
      builder: (context, state) => const LandingPage(),
    ),

    // -------------------------------
    // Login
    // -------------------------------
    GoRoute(
      path: '/login',
      builder: (context, state) {
        final redirectTo = state.uri.queryParameters['from'];
        return LoginPage(redirectTo: redirectTo);
      },
    ),

    // -------------------------------
    // OAuth callback
    // -------------------------------
    GoRoute(
      path: '/oauth/callback',
      builder: (context, state) => OAuthCallbackPage(uri: state.uri),
    ),

    // -------------------------------
    // Dashboard
    // -------------------------------
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardPage(),
    ),

    // -------------------------------
    // ✅ Public certificate verification
    // -------------------------------
    GoRoute(
      path: '/verify/:certificateId',
      builder: (context, state) {
        final certificateId = state.pathParameters['certificateId']!;
        return CertificateVerificationPage(certificateId: certificateId);
      },
    ),

    // -------------------------------
    // Courses
    // -------------------------------
    GoRoute(
      path: '/courses',
      builder: (context, state) => const CourseListPage(),
    ),
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
    // Notes / Video
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
    // Chat / Curriculum / Progress
    // -------------------------------
    GoRoute(
      path: '/student-hub',
      builder: (context, state) => const StudentHubPage(),
    ),
    GoRoute(
      path: '/command-center',
      builder: (context, state) => const CommandCenterPage(),
    ),
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
    // Certificate page
    // -------------------------------
    GoRoute(
      path: '/certificate',
      builder: (context, state) => const SubjectCertificatePage(),
    ),

    // -------------------------------
    // Admin
    // -------------------------------
    GoRoute(
      path: '/admin',
      builder: (context, state) => const AdminDashboardPage(),
    ),

    // -------------------------------
    // Debug
    // -------------------------------
    if (kDebugMode)
      GoRoute(
        path: '/debug',
        builder: (context, state) => const DebugRoutesPage(),
      ),
  ],
);
