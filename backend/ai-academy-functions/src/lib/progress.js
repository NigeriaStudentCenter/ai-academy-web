const { TableClient, odata } = require("@azure/data-tables");

function table(name) {
  return TableClient.fromConnectionString(process.env.AzureWebJobsStorage, name);
}

function parseLessons(raw) {
  try {
    const list = JSON.parse(raw || "[]");
    return Array.isArray(list) ? list.map(String) : [];
  } catch {
    return [];
  }
}

/** Progress rows for a learner: [{ courseId, completedLessons, completion, updatedAt }] */
async function listProgress(userId) {
  const results = [];
  for await (const entity of table("LearnerProgress").listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${userId}` },
  })) {
    results.push({
      courseId: entity.rowKey,
      completedLessons: parseLessons(entity.completedLessons),
      completion: entity.completion ?? 0,
      updatedAt: entity.updatedAt,
    });
  }
  return results;
}

async function getProgress(userId, courseId) {
  try {
    const entity = await table("LearnerProgress").getEntity(userId, courseId);
    return parseLessons(entity.completedLessons);
  } catch (err) {
    if (err.statusCode === 404) return [];
    throw err;
  }
}

async function saveProgress(userId, courseId, completedLessons, completion) {
  const progress = table("LearnerProgress");
  await progress.createTable().catch(() => {});
  await progress.upsertEntity({
    partitionKey: userId,
    rowKey: courseId,
    completedLessons: JSON.stringify(completedLessons),
    completion,
    updatedAt: new Date().toISOString(),
  });
}

async function listCertificates(userId) {
  const results = [];
  for await (const entity of table("LearnerCertificates").listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${userId}` },
  })) {
    results.push(entity);
  }
  return results;
}

/** Issues a certificate once per learner per course; returns the certificate. */
async function issueCertificate(user, course) {
  const existing = (await listCertificates(user.userId)).find(
    (c) => c.courseId === course.courseId
  );
  if (existing) return existing;

  const certificates = table("LearnerCertificates");
  await certificates.createTable().catch(() => {});
  const certificateId = `AIA-${crypto.randomUUID().split("-")[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const certificate = {
    partitionKey: user.userId,
    rowKey: certificateId,
    certificateId,
    learnerName: user.name,
    courseId: course.courseId,
    courseTitle: course.title,
    issuedAt: new Date().toISOString(),
    authorityName: "Dr. John Aikeremiokha",
    authorityTitle: "Director of Learning, AI Academy",
  };
  await certificates.createEntity(certificate);
  return certificate;
}

module.exports = {
  listProgress,
  getProgress,
  saveProgress,
  listCertificates,
  issueCertificate,
};
