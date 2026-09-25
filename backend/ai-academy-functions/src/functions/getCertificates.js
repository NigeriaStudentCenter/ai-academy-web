const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

app.http("getCertificates", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const userId = request.headers.get("x-ms-client-principal-id");

    if (!userId) {
      return { status: 401 };
    }

    const certificateTable = TableClient.fromConnectionString(
      process.env.AzureWebJobsStorage,
      "LearnerCertificates"
    );

    const results = [];

    for await (const entity of certificateTable.listEntities({
      queryOptions: { filter: `PartitionKey eq '${userId}'` },
    })) {
      results.push({
        certificateId: entity.certificateId,
        learnerName: entity.learnerName,
        courseId: entity.courseId,
        courseTitle: entity.courseTitle,
        issuedAt: entity.issuedAt,
        authorityName: entity.authorityName,
        authorityTitle: entity.authorityTitle,
      });
    }

    return {
      status: 200,
      jsonBody: results,
    };
  },
});
