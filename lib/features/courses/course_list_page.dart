import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/courses/course_api_service.dart';
import '../../core/courses/course_data.dart';
import '../../core/theme/app_colors.dart';
import '../../widgets/app_nav_drawer.dart';

/// Courses the signed-in learner can take (filtered by the backend by
/// audience: teenskills.co.uk → Teens, everyone else → Professional),
/// grouped by category, with category chips and search.
class CourseListPage extends StatefulWidget {
  const CourseListPage({super.key});

  @override
  State<CourseListPage> createState() => _CourseListPageState();
}

typedef _Catalog = ({
  List<CourseSummary> courses,
  List<CourseCategory> categories
});

class _CourseListPageState extends State<CourseListPage> {
  late Future<_Catalog> _catalog;
  String? _category; // null = all categories
  String _query = '';

  @override
  void initState() {
    super.initState();
    _catalog = CourseApiService.listCatalog();
  }

  void _retry() => setState(() => _catalog = CourseApiService.listCatalog());

  bool _matches(CourseSummary c) {
    if (_category != null && c.category != _category) return false;
    if (_query.isEmpty) return true;
    final q = _query.toLowerCase();
    return c.title.toLowerCase().contains(q) ||
        c.description.toLowerCase().contains(q);
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
        title: const Text(
          "My Courses",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
        ),
      ),
      body: FutureBuilder<_Catalog>(
        future: _catalog,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.nearWhite),
            );
          }

          if (snapshot.hasError) {
            return _Message(
              text:
                  'We could not load your courses. Check your connection and try again.',
              action: TextButton(
                onPressed: _retry,
                child: const Text('Retry',
                    style: TextStyle(color: AppColors.nearWhite)),
              ),
            );
          }

          final catalog = snapshot.data!;
          if (catalog.courses.isEmpty) {
            return const _Message(
                text: 'No courses have been assigned to your account yet.');
          }

          // Categories in display order; courses without a known category last.
          final known = catalog.categories.map((c) => c.id).toSet();
          final groups = <(CourseCategory, List<CourseSummary>)>[
            for (final cat in catalog.categories)
              (
                cat,
                catalog.courses
                    .where((c) => c.category == cat.id && _matches(c))
                    .toList()
              ),
            (
              const CourseCategory('', 'More courses'),
              catalog.courses
                  .where((c) => !known.contains(c.category) && _matches(c))
                  .toList(),
            ),
          ].where((g) => g.$2.isNotEmpty).toList();

          return Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 760),
              child: CustomScrollView(
                slivers: [
                  SliverToBoxAdapter(child: _searchBox()),
                  if (catalog.categories.length > 1)
                    SliverToBoxAdapter(child: _chips(catalog)),
                  if (groups.isEmpty)
                    const SliverToBoxAdapter(
                      child: Padding(
                        padding: EdgeInsets.all(32),
                        child: Text('No courses match your search.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                color: AppColors.nearWhite, fontSize: 16)),
                      ),
                    ),
                  for (final (cat, courses) in groups) ...[
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(20, 18, 20, 8),
                        child: Text(
                          '${cat.name} (${courses.length})',
                          style: const TextStyle(
                            color: AppColors.accentGold,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    SliverPadding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      sliver: SliverList.separated(
                        itemCount: courses.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, i) =>
                            _CourseCard(course: courses[i]),
                      ),
                    ),
                  ],
                  const SliverToBoxAdapter(child: SizedBox(height: 32)),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _searchBox() => Padding(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 4),
        child: TextField(
          onChanged: (v) => setState(() => _query = v.trim()),
          style: const TextStyle(color: AppColors.darkGreen),
          decoration: InputDecoration(
            hintText: 'Search courses',
            prefixIcon: const Icon(Icons.search, color: AppColors.darkGreen),
            filled: true,
            fillColor: AppColors.nearWhite,
            isDense: true,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
          ),
        ),
      );

  Widget _chips(_Catalog catalog) {
    Widget chip(String label, String? id) {
      final selected = _category == id;
      return Padding(
        padding: const EdgeInsets.only(right: 8),
        child: ChoiceChip(
          label: Text(label),
          selected: selected,
          showCheckmark: false,
          selectedColor: AppColors.accentGold,
          backgroundColor: AppColors.nearWhite,
          labelStyle: TextStyle(
            color: selected ? Colors.white : AppColors.darkGreen,
            fontWeight: FontWeight.w600,
          ),
          onSelected: (_) => setState(() => _category = selected ? null : id),
        ),
      );
    }

    return SizedBox(
      height: 52,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.fromLTRB(20, 8, 12, 4),
        children: [
          chip('All', null),
          for (final c in catalog.categories) chip(c.name, c.id),
        ],
      ),
    );
  }
}

class _CourseCard extends StatelessWidget {
  final CourseSummary course;
  const _CourseCard({required this.course});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: AppColors.nearWhite,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: const Icon(Icons.school, color: AppColors.darkGreen, size: 36),
        title: Text(
          course.title,
          style: const TextStyle(
              fontWeight: FontWeight.bold, color: AppColors.darkGreen),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Text(
            [
              course.description,
              [
                course.level,
                course.estimatedDuration,
                '${course.lessonCount} lessons',
              ].where((s) => s.isNotEmpty).toSet().join(' • '),
            ].where((s) => s.isNotEmpty).join('\n'),
            maxLines: 5,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        trailing: const Icon(Icons.arrow_forward, color: AppColors.darkGreen),
        onTap: () => context.go('/course/${course.courseId}'),
      ),
    );
  }
}

class _Message extends StatelessWidget {
  final String text;
  final Widget? action;

  const _Message({required this.text, this.action});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              text,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.nearWhite, fontSize: 16),
            ),
            if (action != null) ...[const SizedBox(height: 12), action!],
          ],
        ),
      ),
    );
  }
}
