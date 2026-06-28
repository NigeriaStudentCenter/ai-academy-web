import 'package:flutter/material.dart';

import '../../core/certificates/certificate_service.dart';
import '../../core/certificates/course_certificate.dart';
import '../../core/theme/app_colors.dart';

class CertificateVerificationPage extends StatelessWidget {
  final String certificateId;

  const CertificateVerificationPage({
    super.key,
    required this.certificateId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkGreen,
      appBar: AppBar(
        backgroundColor: AppColors.darkGreen,
        foregroundColor: AppColors.nearWhite,
        title: const Text("Certificate Verification"),
      ),
      body: FutureBuilder<CourseCertificate?>(
        future: CertificateService.verifyCertificate(certificateId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  "Unable to verify this certificate right now.",
                  style: TextStyle(color: AppColors.nearWhite, fontSize: 16),
                  textAlign: TextAlign.center,
                ),
              ),
            );
          }

          final certificate = snapshot.data;

          if (certificate == null) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.nearWhite,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.cancel, color: Colors.red, size: 48),
                      const SizedBox(height: 16),
                      Text(
                        "Certificate Not Found",
                        style: TextStyle(
                          color: AppColors.darkGreen,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "This certificate ID is not valid or does not exist.",
                        style: TextStyle(color: AppColors.darkGreen),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            );
          }

          return Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.nearWhite,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.verified,
                      color: Color(0xFF2E8B57),
                      size: 56,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      "Certificate Verified",
                      style: TextStyle(
                        color: AppColors.darkGreen,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 20),
                    _infoRow("Learner", certificate.learnerName),
                    _infoRow("Course", certificate.courseTitle),
                    _infoRow(
                      "Issued On",
                      certificate.issuedAt.toLocal().toString().split(' ').first,
                    ),
                    _infoRow("Certificate ID", certificate.certificateId),
                    _infoRow("Authority", certificate.authorityName),
                    _infoRow("Title", certificate.authorityTitle),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              "$label:",
              style: TextStyle(
                color: AppColors.darkGreen,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(color: AppColors.darkGreen),
            ),
          ),
        ],
      ),
    );
  }
}