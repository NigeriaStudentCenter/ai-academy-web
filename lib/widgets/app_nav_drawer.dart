import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart'; // ✅ REQUIRED FOR GoRouter

class AppNavDrawer extends StatelessWidget {
  const AppNavDrawer({super.key});

  // 🔧 Toggle this during development
  static const bool showAdmin = true;
  static const bool showDebug = true;

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            // ===============================
            // Drawer Header
            // ===============================
            UserAccountsDrawerHeader(
              decoration: const BoxDecoration(
                color: Colors.blue,
              ),
              accountName: const Text(
                'Dr. John Aikeremiokha',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              accountEmail: const Text('AI Academy'),
              currentAccountPicture: const CircleAvatar(
                backgroundColor: Colors.white,
                child: Icon(
                  Icons.person,
                  size: 40,
                  color: Colors.blue,
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
                    title: 'Courses',
                    routeName: '/courses',
                  ),

                  _drawerItem(
                    context,
                    icon: Icons.person,
                    title: 'Profile',
                    routeName: '/profile',
                  ),

                  const Divider(),

                  // ===============================
                  // Admin (optional)
                  // ===============================
                  if (showAdmin)
                    _drawerItem(
                      context,
                      icon: Icons.admin_panel_settings,
                      title: 'Admin',
                      routeName: '/admin',
                    ),

                  // ===============================
                  // Debug (optional)
                  // ===============================
                  if (showDebug)
                    _drawerItem(
                      context,
                      icon: Icons.bug_report,
                      title: 'Debug',
                      routeName: '/debug',
                    ),
                ],
              ),
            ),

            // ===============================
            // Footer
            // ===============================
            const Divider(),
            Padding(
              padding: const EdgeInsets.all(12.0),
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