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
    const { courseId, completion } = body || {};

    if (!courseId || completion === undefined) {
      return { status: 400 };
    }

    const tableClient = TableClient.fromConnectionString(
      process.env.AzureWebJobsStorage,
      "LearnerProgress"
    );

    await tableClient.upsertEntity({
      partitionKey: userId,
      rowKey: courseId,
      completion,
      updatedAt: new Date().toISOString(),
    });

    return { status: 200 };
  },
});