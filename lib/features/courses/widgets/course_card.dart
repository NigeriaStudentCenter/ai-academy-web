import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class CourseCard extends StatelessWidget {
  final String id;
  final String title;
  final String thumbnail;
  final VoidCallback onTap;

  const CourseCard({
    super.key,
    required this.id,
    required this.title,
    required this.thumbnail,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.nearWhite,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            // Thumbnail
            Container(
              width: 110,
              height: 110,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                image: DecorationImage(
                  fit: BoxFit.cover,
                  image: NetworkImage(thumbnail),
                ),
              ),
            ),

            const SizedBox(width: 16),

            // Title
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  color: AppColors.darkGreen,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            const Icon(Icons.arrow_forward_ios, color: AppColors.darkGreen),
          ],
        ),
      ),
    );
  }
}