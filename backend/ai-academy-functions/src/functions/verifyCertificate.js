const { app } = require("@azure/functions");
const progress = require("../lib/progress");

// Public (no sign-in): lets anyone holding a certificate link confirm it is
// genuine. Returns only what is printed on the certificate itself.
app.http("verifyCertificate", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "verifyCertificate/{certificateId}",
  handler: async (request, context) => {
    const certificateId = String(request.params.certificateId || "");
    if (!/^[A-Za-z0-9-]{6,80}$/.test(certificateId)) {
      return { status: 404, jsonBody: { message: "Certificate not found." } };
    }

    const certificate = await progress.findCertificate(certificateId);
    if (!certificate) {
      return { status: 404, jsonBody: { message: "Certificate not found." } };
    }

    return {
      status: 200,
      jsonBody: {
        certificateId: certificate.certificateId,
        learnerName: certificate.learnerName,
        courseId: certificate.courseId,
        courseTitle: certificate.courseTitle,
        issuedAt: certificate.issuedAt,
        authorityName: certificate.authorityName,
        authorityTitle: certificate.authorityTitle,
      },
    };
  },
});
