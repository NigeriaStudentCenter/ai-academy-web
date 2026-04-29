import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import 'widgets/course_card.dart';

class CourseListPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Example static list (replace with your real data later)
    final courses = [
      {
        "id": "course1",
        "title": "Introduction to Leadership",
        "thumbnail": "https://via.placeholder.com/150"
      },
      {
        "id": "course2",
        "title": "Communication Skills",
        "thumbnail": "https://via.placeholder.com/150"
      },
      {
        "id": "course3",
        "title": "Professional Ethics",
        "thumbnail": "https://via.placeholder.com/150"
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.darkGreen,
      appBar: AppBar(
        backgroundColor: AppColors.darkGreen,
        elevation: 0,
        title: const Text(
          "Courses",
          style: TextStyle(
            color: AppColors.nearWhite,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: ListView.builder(
          itemCount: courses.length,
          itemBuilder: (context, index) {
            final course = courses[index];

            return CourseCard(
              id: course["id"]!,
              title: course["title"]!,
              thumbnail: course["thumbnail"]!,
              onTap: () {
                Navigator.pushNamed(
                  context,
                  "/course_detail",
                  arguments: {
                    "id": course["id"],
                    "title": course["title"],
                  },
                );
              },
            );
          },
        ),
      ),
    );
  }
}