import 'course_certificate.dart';
import 'certificate_api_service.dart';

class CertificateService {
  static Future<List<CourseCertificate>> getUnlockedCertificates() async {
    try {
      return await CertificateApiService.fetchCertificates();
    } catch (_) {
      return [];
    }
  }

  static Future<bool> hasAnyCertificates() async {
    final certificates = await getUnlockedCertificates();
    return certificates.isNotEmpty;
  }

  static Future<bool> hasCertificateForCourse(String courseId) async {
    final certificates = await getUnlockedCertificates();
    return certificates.any((c) => c.courseId == courseId);
  }

  static Future<CourseCertificate?> getCertificateForCourse(
    String courseId,
  ) async {
    final certificates = await getUnlockedCertificates();

    try {
      return certificates.firstWhere((c) => c.courseId == courseId);
    } catch (_) {
      return null;
    }
  }

  static Future<CourseCertificate?> verifyCertificate(
    String certificateId,
  ) async {
    return await CertificateApiService.verifyCertificate(certificateId);
  }
}