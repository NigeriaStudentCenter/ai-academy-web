import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/certificates/certificate_service.dart';
import '../../core/certificates/course_certificate.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  static const String _verificationBaseUrl =
      'https://black-sky-0782ebe03.7.azurestaticapps.net';

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
                // =========================
                // Profile Header
                // =========================
                const SizedBox(height: 20),

                const CircleAvatar(
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
                  textAlign: TextAlign.center,
                ),

                Text(
                  "NIGERIA STUDENT AMBASSADOR",
                  style: TextStyle(
                    color: AppColors.nearWhite.withOpacity(0.8),
                    fontSize: 16,
                  ),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 30),

                // =========================
                // Progress Card
                // =========================
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

                // =========================
                // Certificates Section
                // =========================
                const _CertificatesSection(
                  verificationBaseUrl: _verificationBaseUrl,
                ),

                const SizedBox(height: 30),

                // =========================
                // AI Foundations Course Button
                // =========================
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      context.go('/course/ai-foundations');
                    },
                    icon: const Icon(Icons.school),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.nearWhite,
                      foregroundColor: AppColors.darkGreen,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    label: const Text(
                      "Start AI Foundations Course",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // =========================
                // View Courses Button
                // =========================
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      context.go('/course/flutter-ai');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.nearWhite,
                      foregroundColor: AppColors.darkGreen,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      "View All Courses",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // =========================
                // AI Assistant Button
                // =========================
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      context.go('/chat');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accentGold,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      "Ask AI Assistant",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
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

class _CertificatesSection extends StatelessWidget {
  final String verificationBaseUrl;

  const _CertificatesSection({
    required this.verificationBaseUrl,
  });

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<CourseCertificate>>(
      future: CertificateService.getUnlockedCertificates(),
      builder: (context, snapshot) {
        // =========================
        // Loading state
        // =========================
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.nearWhite,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        // =========================
        // Error state
        // =========================
        if (snapshot.hasError) {
          return Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.nearWhite,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.error_outline, color: Colors.red),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    "Unable to load certificates right now.",
                    style: TextStyle(
                      color: AppColors.darkGreen,
                      fontSize: 15,
                    ),
                  ),
                ),
              ],
            ),
          );
        }

        final certificates = snapshot.data ?? [];

        // =========================
        // Empty state
        // =========================
        if (certificates.isEmpty) {
          return Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.nearWhite,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.lock_outline, color: AppColors.darkGreen),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    "Complete courses to unlock your certificates.",
                    style: TextStyle(
                      color: AppColors.darkGreen,
                      fontSize: 15,
                    ),
                  ),
                ),
              ],
            ),
          );
        }

        // =========================
        // Certificates list
        // =========================
        return Container(
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
                "Your Certificates",
                style: TextStyle(
                  color: AppColors.darkGreen,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              ...certificates.map(
                (certificate) => _CertificateCard(
                  certificate: certificate,
                  verificationBaseUrl: verificationBaseUrl,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _CertificateCard extends StatelessWidget {
  final CourseCertificate certificate;
  final String verificationBaseUrl;

  const _CertificateCard({
    required this.certificate,
    required this.verificationBaseUrl,
  });

  @override
  Widget build(BuildContext context) {
    final verificationLink =
        '$verificationBaseUrl/verify/${certificate.certificateId}';

    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.darkGreen.withOpacity(0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.darkGreen.withOpacity(0.15),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.verified,
                color: Color(0xFF2E8B57),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  certificate.courseTitle,
                  style: TextStyle(
                    color: AppColors.darkGreen,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          Text(
            "Issued on ${certificate.issuedAt.toLocal().toString().split(' ').first}",
            style: TextStyle(
              color: AppColors.darkGreen.withOpacity(0.75),
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            "Certificate ID: ${certificate.certificateId}",
            style: TextStyle(
              color: AppColors.darkGreen.withOpacity(0.65),
              fontSize: 12,
            ),
          ),

          const SizedBox(height: 14),

          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              ElevatedButton.icon(
                onPressed: () {
                  context.go('/verify/${certificate.certificateId}');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.darkGreen,
                  foregroundColor: AppColors.nearWhite,
                ),
                icon: const Icon(Icons.verified_outlined, size: 18),
                label: const Text("Verify"),
              ),

              ElevatedButton.icon(
                onPressed: () async {
                  await Clipboard.setData(
                    ClipboardData(text: verificationLink),
                  );

                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Verification link copied"),
                      ),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentGold,
                  foregroundColor: Colors.white,
                ),
                icon: const Icon(Icons.link, size: 18),
                label: const Text("Copy Link"),
              ),

              ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(
                        "Certificate download will be enabled next.",
                      ),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.nearWhite,
                  foregroundColor: AppColors.darkGreen,
                ),
                icon: const Icon(Icons.download, size: 18),
                label: const Text("Download"),
              ),
            ],
          ),
        ],
      ),
    );
  }
}