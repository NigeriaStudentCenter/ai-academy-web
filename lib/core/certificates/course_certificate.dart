class CourseCertificate {
  final String certificateId;
  final String learnerName;
  final String courseId;
  final String courseTitle;
  final DateTime issuedAt;
  final String authorityName;
  final String authorityTitle;

  const CourseCertificate({
    required this.certificateId,
    required this.learnerName,
    required this.courseId,
    required this.courseTitle,
    required this.issuedAt,
    required this.authorityName,
    required this.authorityTitle,
  });

  factory CourseCertificate.fromJson(Map<String, dynamic> json) {
    return CourseCertificate(
      certificateId: json['certificateId'] as String,
      learnerName: json['learnerName'] as String,
      courseId: json['courseId'] as String,
      courseTitle: json['courseTitle'] as String,
      issuedAt: DateTime.parse(json['issuedAt'] as String),
      authorityName: json['authorityName'] as String,
      authorityTitle: json['authorityTitle'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'certificateId': certificateId,
      'learnerName': learnerName,
      'courseId': courseId,
      'courseTitle': courseTitle,
      'issuedAt': issuedAt.toIso8601String(),
      'authorityName': authorityName,
      'authorityTitle': authorityTitle,
    };
  }
}