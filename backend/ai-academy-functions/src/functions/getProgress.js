const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

app.http("getProgress", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const userId = request.headers.get("x-ms-client-principal-id");

    if (!userId) {
      return { status: 401 };
    }

    const tableClient = TableClient.fromConnectionString(
      process.env.AzureWebJobsStorage,
      "LearnerProgress"
    );

    const results = [];

    for await (const entity of tableClient.listEntities({
      queryOptions: { filter: `PartitionKey eq '${userId}'` },
    })) {
      results.push({
        courseId: entity.rowKey,
        completion: entity.completion,
      });
    }

    return {
      status: 200,
      jsonBody: results,
    };
  },
});
