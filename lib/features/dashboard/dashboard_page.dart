import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class DashboardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkGreen,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Profile Header
                const SizedBox(height: 20),

                CircleAvatar(
                  radius: 50,
                  backgroundImage: AssetImage("assets/images/john_photo.jpg"),
                ),

                const SizedBox(height: 16),

                Text(
                  "Dr. JOHN AIKEREMIOKHA",
                  style: TextStyle(
                    color: AppColors.nearWhite,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                Text(
                  "NIGERIA STUDENT AMBASSADOR",
                  style: TextStyle(
                    color: AppColors.nearWhite.withOpacity(0.8),
                    fontSize: 16,
                  ),
                ),

                const SizedBox(height: 30),

                // Progress Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.nearWhite,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Your Progress",
                        style: TextStyle(
                          color: AppColors.darkGreen,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),
                      LinearProgressIndicator(
                        value: 0.35,
                        backgroundColor: Colors.grey[300],
                        color: AppColors.darkGreen,
                      ),
                      const SizedBox(height: 10),
                      Text(
                        "35% completed",
                        style: TextStyle(color: AppColors.darkGreen),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 30),

                // View Courses Button
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushNamed(context, "/courses");
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.nearWhite,
                    foregroundColor: AppColors.darkGreen,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Center(
                    child: Text(
                      "View All Courses",
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // AI Assistant Button
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.accentGold,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Center(
                    child: Text(
                      "Ask AI Assistant",
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),

                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }
}