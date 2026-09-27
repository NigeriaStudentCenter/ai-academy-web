// Stored store subscriptions: Subscriptions (PK userId, RK "current") is what
// access.js reads; SubscriptionOwners (PK platform, RK originalTransactionId)
// ties each store subscription to one AI Academy account, so a purchase can't
// be claimed by a second account.

const { TableClient } = require("@azure/data-tables");
const { subscriptions } = require("./access");

function owners() {
  return TableClient.fromConnectionString(process.env.AzureWebJobsStorage, "SubscriptionOwners");
}

async function ensure(table) {
  try {
    await table.createTable();
  } catch (err) {
    if (err.statusCode !== 409) throw err;
  }
}

async function ownerOf(platform, originalTransactionId) {
  try {
    return (await owners().getEntity(platform, originalTransactionId)).userId;
  } catch (err) {
    if (err.statusCode === 404) return null;
    throw err;
  }
}

/** Records the subscription for this learner (and claims it if unclaimed). */
async function saveSubscription(userId, platform, sub, { grants }) {
  const own = owners();
  const subs = subscriptions();
  await Promise.all([ensure(own), ensure(subs)]);
  await own.upsertEntity({ partitionKey: platform, rowKey: sub.originalTransactionId, userId });
  await subs.upsertEntity({
    partitionKey: userId,
    rowKey: "current",
    platform,
    productId: sub.productId,
    originalTransactionId: sub.originalTransactionId,
    environment: sub.environment || "",
    storeStatus: sub.status,
    status: grants ? "active" : "inactive",
    expiresAt: sub.expiresAt,
    updatedAt: new Date().toISOString(),
  });
}

module.exports = { ownerOf, saveSubscription };
