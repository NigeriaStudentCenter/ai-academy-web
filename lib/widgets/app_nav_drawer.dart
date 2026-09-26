import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart'; // ✅ REQUIRED FOR GoRouter

import '../core/auth/app_auth_state.dart';
import '../core/auth/entra_auth_service.dart';
import '../core/theme/app_colors.dart';

class AppNavDrawer extends StatelessWidget {
  const AppNavDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final user = AppAuthState.currentUser;

    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            // ===============================
            // Drawer Header (signed-in learner)
            // ===============================
            UserAccountsDrawerHeader(
              decoration: const BoxDecoration(
                color: AppColors.darkGreen,
              ),
              accountName: Text(
                user?.displayName ?? 'AI Academy',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              accountEmail: Text(user?.email ?? ''),
              currentAccountPicture: const CircleAvatar(
                backgroundColor: AppColors.nearWhite,
                child: Icon(
                  Icons.person,
                  size: 40,
                  color: AppColors.darkGreen,
                ),
              ),
            ),

            // ===============================
            // Navigation Items
            // ===============================
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  _drawerItem(
                    context,
                    icon: Icons.dashboard,
                    title: 'Dashboard',
                    routeName: '/dashboard',
                  ),

                  _drawerItem(
                    context,
                    icon: Icons.menu_book,
                    title: 'My Courses',
                    routeName: '/courses',
                  ),

                  _drawerItem(
                    context,
                    icon: Icons.chat,
                    title: 'AI Tutor',
                    routeName: '/chat',
                  ),

                  // AI Academy (professional): the five live-web student tools.
                  if (AppAuthState.isProfessional)
                    _drawerItem(
                      context,
                      icon: Icons.travel_explore,
                      title: 'Student Success Hub',
                      routeName: '/student-hub',
                    ),
                  if (AppAuthState.isProfessional)
                    _drawerItem(
                      context,
                      icon: Icons.storefront,
                      title: 'Business Marketing Hub',
                      routeName: '/business-hub',
                    ),

                  // AI Academy for Teens: the Nigerian / British curriculum tutor.
                  if (AppAuthState.isTeens)
                    _drawerItem(
                      context,
                      icon: Icons.hub,
                      title: 'Command Center',
                      routeName: '/command-center',
                    ),

                  const Divider(),

                  // ===============================
                  // Admin (Entra "Admin" app role only)
                  // ===============================
                  if (AppAuthState.isAdmin)
                    _drawerItem(
                      context,
                      icon: Icons.admin_panel_settings,
                      title: 'Admin',
                      routeName: '/admin',
                    ),

                  // ===============================
                  // Debug (development builds only)
                  // ===============================
                  if (kDebugMode)
                    _drawerItem(
                      context,
                      icon: Icons.bug_report,
                      title: 'Debug',
                      routeName: '/debug',
                    ),

                  ListTile(
                    leading: const Icon(Icons.logout),
                    title: const Text('Sign out'),
                    onTap: () async {
                      Navigator.pop(context);
                      await EntraAuthService.signOut();
                      if (context.mounted) context.go('/');
                    },
                  ),
                ],
              ),
            ),

            // ===============================
            // Footer
            // ===============================
            const Divider(),
            const Padding(
              padding: EdgeInsets.all(12.0),
              child: Text(
                'AI Academy v1.0.0',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ===============================
  // Drawer Item Builder (GoRouter)
  // ===============================
  Widget _drawerItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String routeName,
  }) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      onTap: () {
        Navigator.pop(context); // ✅ close drawer
        context.go(routeName);  // ✅ GoRouter navigation
      },
    );
  }
}
