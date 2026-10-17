// Public learners (Firebase sign-in) choose once whether they're a student
// aged 13–17 (Teens sections) or an adult / professional (Professional
// sections). Microsoft accounts are routed by email domain instead
// (src/lib/auth.js). Table LearnerProfiles: PK userId, RK "profile", { track }.

const { TableClient } = require("@azure/data-tables");

const TRACKS = ["teens", "professional"];
const cache = new Map(); // userId -> { track, at }
const TTL_MS = 5 * 60 * 1000;

function table() {
  return TableClient.fromConnectionString(process.env.AzureWebJobsStorage, "LearnerProfiles");
}

async function getTrack(userId, { now = Date.now() } = {}) {
  const hit = cache.get(userId);
  if (hit && now - hit.at < TTL_MS) return hit.track;
  let track = null;
  try {
    track = (await table().getEntity(userId, "profile")).track || null;
  } catch (err) {
    if (err.statusCode !== 404) throw err;
  }
  cache.set(userId, { track, at: now });
  return track;
}

async function setTrack(userId, track) {
  if (!TRACKS.includes(track)) throw new Error("Unknown track");
  const t = table();
  try {
    await t.createTable();
  } catch (err) {
    if (err.statusCode !== 409) throw err;
  }
  await t.upsertEntity({ partitionKey: userId, rowKey: "profile", track, updatedAt: new Date().toISOString() });
  cache.set(userId, { track, at: Date.now() });
}

async function deleteProfile(userId) {
  cache.delete(userId);
  try {
    await table().deleteEntity(userId, "profile");
  } catch (err) {
    if (err.statusCode !== 404) throw err;
  }
}

/** Course audiences for a track (Professional until a learner chooses). */
function audiencesFor(track) {
  return track === "teens" ? ["teens"] : ["professional"];
}

module.exports = { TRACKS, getTrack, setTrack, deleteProfile, audiencesFor };
