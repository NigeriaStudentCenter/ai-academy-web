import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/api/api_client.dart';
import '../../core/courses/course_api_service.dart';
import '../../core/courses/course_data.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/app_nav_drawer.dart';

typedef _Catalog = ({
  List<CourseSummary> courses,
  List<CourseCategory> categories
});

/// Admin (Entra "Admin" app role): the course catalogue at a glance and a
/// button to pull the latest SharePoint course changes immediately instead of
/// waiting for the 30-minute sync.
class AdminDashboardPage extends StatefulWidget {
  const AdminDashboardPage({super.key});

  @override
  State<AdminDashboardPage> createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  late Future<_Catalog> _catalog = CourseApiService.listCatalog();
  bool _syncing = false;
  String? _syncResult;

  void _reload() =>
      setState(() => _catalog = CourseApiService.listCatalog());

  Future<void> _sync() async {
    setState(() {
      _syncing = true;
      _syncResult = null;
    });
    String result;
    try {
      // A full sync reads every course site and takes about a minute.
      final response = await ApiClient.post('syncCourses', '{}',
          timeout: const Duration(minutes: 3));
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      result = response.statusCode == 200
          ? 'Synced ${(json['courses'] as List? ?? []).length} SharePoint courses.'
          : 'Sync failed: ${json['error'] ?? 'HTTP ${response.statusCode}'}';
    } catch (e) {
      result = 'Sync failed: $e';
    }
    if (!mounted) return;
    setState(() {
      _syncing = false;
      _syncResult = result;
      _catalog = CourseApiService.listCatalog();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkGreen,
      drawer: const AppNavDrawer(),
      appBar: AppBar(
        backgroundColor: AppColors.darkGreen,
        foregroundColor: AppColors.nearWhite,
        elevation: 0,
        title: const Text('Admin',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
        actions: [
          IconButton(
            tooltip: 'Dashboard',
            icon: const Icon(Icons.home),
            onPressed: () => context.go('/dashboard'),
          ),
        ],
      ),
      body: FutureBuilder<_Catalog>(
        future: _catalog,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(
                child: CircularProgressIndicator(color: AppColors.nearWhite));
          }
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  const Text('Could not load the course catalogue.',
                      textAlign: TextAlign.center,
                      style:
                          TextStyle(color: AppColors.nearWhite, fontSize: 16)),
                  TextButton(
                    onPressed: _reload,
                    child: const Text('Retry',
                        style: TextStyle(color: AppColors.accentGold)),
                  ),
                ]),
              ),
            );
          }

          final catalog = snapshot.data!;
          final lessons =
              catalog.courses.fold<int>(0, (sum, c) => sum + c.lessonCount);
          final known = catalog.categories.map((c) => c.id).toSet();
          final rows = [
            for (final cat in catalog.categories)
              (
                cat.name,
                catalog.courses.where((c) => c.category == cat.id).length
              ),
            (
              'Other',
              catalog.courses.where((c) => !known.contains(c.category)).length
            ),
          ].where((r) => r.$2 > 0).toList();

          return Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 760),
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  Row(children: [
                    _stat('Courses', catalog.courses.length),
                    const SizedBox(width: 12),
                    _stat('Lessons', lessons),
                    const SizedBox(width: 12),
                    _stat('Categories', rows.length),
                  ]),
                  const SizedBox(height: 20),
                  _card(
                    title: 'SharePoint courses',
                    children: [
                      const Text(
                        'Course pages sync automatically every 30 minutes. '
                        'Sync now to publish a change straight away.',
                        style: TextStyle(color: AppColors.darkGreen),
                      ),
                      const SizedBox(height: 12),
                      Row(children: [
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.darkGreen,
                            foregroundColor: AppColors.nearWhite,
                          ),
                          onPressed: _syncing ? null : _sync,
                          icon: _syncing
                              ? const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: AppColors.nearWhite))
                              : const Icon(Icons.sync),
                          label: Text(_syncing ? 'Syncing…' : 'Sync courses now'),
                        ),
                      ]),
                      if (_syncResult != null) ...[
                        const SizedBox(height: 10),
                        Text(_syncResult!,
                            style: const TextStyle(color: AppColors.darkGreen)),
                      ],
                    ],
                  ),
                  const SizedBox(height: 16),
                  _card(
                    title: 'Courses by category',
                    children: [
                      for (final (name, count) in rows)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 6),
                          child: Row(children: [
                            Expanded(
                                child: Text(name,
                                    style: const TextStyle(
                                        color: AppColors.darkGreen))),
                            Text('$count',
                                style: const TextStyle(
                                    color: AppColors.darkGreen,
                                    fontWeight: FontWeight.bold)),
                          ]),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _stat(String label, int value) => Expanded(
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.nearWhite,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(children: [
            Text('$value',
                style: const TextStyle(
                    color: AppColors.darkGreen,
                    fontSize: 24,
                    fontWeight: FontWeight.bold)),
            Text(label, style: const TextStyle(color: AppColors.darkGreen)),
          ]),
        ),
      );

  Widget _card({required String title, required List<Widget> children}) =>
      Card(
        color: AppColors.nearWhite,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: const TextStyle(
                      color: AppColors.darkGreen,
                      fontSize: 17,
                      fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              ...children,
            ],
          ),
        ),
      );
}
