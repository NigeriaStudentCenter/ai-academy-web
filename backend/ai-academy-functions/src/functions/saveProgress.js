const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

app.http("saveProgress", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const userId = request.headers.get("x-ms-client-principal-id");

    if (!userId) {
      return { status: 401 };
    }

    const body = await request.json();
    const { courseId, completion, learnerName } = body || {};

    if (!courseId || completion === undefined) {
      return {
        status: 400,
        jsonBody: { message: "courseId and completion are required." },
      };
    }

    const progressTable = TableClient.fromConnectionString(
      process.env.AzureWebJobsStorage,
      "LearnerProgress"
    );

    await progressTable.upsertEntity({
      partitionKey: userId,
      rowKey: courseId,
      completion,
      updatedAt: new Date().toISOString(),
    });

    // Auto-issue certificate when completion reaches 100%
    if (completion >= 1.0) {
      const certificateTable = TableClient.fromConnectionString(
        process.env.AzureWebJobsStorage,
        "LearnerCertificates"
      );

      // Check if this learner already has a certificate for this course
      const existingCertificates = [];
      for await (const entity of certificateTable.listEntities({
        queryOptions: {
          filter: `PartitionKey eq '${userId}' and courseId eq '${courseId}'`,
        },
      })) {
        existingCertificates.push(entity);
      }

      if (existingCertificates.length === 0) {
        const certificateId = `CERT-${Date.now()}-${courseId}`;

        await certificateTable.createEntity({
          partitionKey: userId,
          rowKey: certificateId,
          certificateId,
          learnerName: learnerName || "Learner",
          courseId,
          courseTitle: courseId.replace(/-/g, " ").toUpperCase(),
          issuedAt: new Date().toISOString(),
          authorityName: "Dr. John Aikeremiokha",
          authorityTitle: "Director of Learning, AI Academy",
        });
      }
    }

    return {
      status: 200,
      jsonBody: { message: "Progress saved successfully." },
    };
  },
});
``