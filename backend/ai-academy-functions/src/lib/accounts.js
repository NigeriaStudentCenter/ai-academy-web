// Creating and deleting AI Academy accounts. Public learners get a Microsoft
// Entra *guest* account in the AI Academy (bsoedu.org) tenant: we send a
// Microsoft invitation to their email; they accept it and then sign in to
// the app with Microsoft like everyone else. Deleting an account removes the
// guest and all their AI Academy data. Staff and school (member) accounts are
// managed by their organisation and can't be deleted from the app.
//
// Needs Microsoft Graph application permissions on the Function App's
// managed identity: User.Invite.All and User.ReadWrite.All.

const { DefaultAzureCredential } = require("@azure/identity");
const { TableClient, odata } = require("@azure/data-tables");

const credential = new DefaultAzureCredential();
const INVITE_REDIRECT = process.env.INVITE_REDIRECT_URL || "https://black-sky-0782ebe03.7.azurestaticapps.net/";
const USER_TABLES = ["LearnerProgress", "LearnerCertificates", "LearnerResponses", "Subscriptions"];
const EMAIL_RE = /^[^\s@<>()",;:]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

async function graph(method, path, body) {
  const token = await credential.getToken("https://graph.microsoft.com/.default");
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    method,
    headers: { Authorization: `Bearer ${token.token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(`Graph ${method} ${path} → ${res.status}: ${json.error?.message || ""}`);
    err.status = res.status;
    throw err;
  }
  return json;
}

function normaliseEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  return EMAIL_RE.test(e) && e.length <= 254 ? e : null;
}

function cleanName(name) {
  return String(name || "").replace(/[<>\r\n]/g, "").trim().slice(0, 80);
}

/** Organisation domains whose people already have accounts (they sign in with those). */
function isOrganisationEmail(email) {
  const domain = email.split("@")[1];
  return ["bsoedu.org", "teenskills.co.uk"].includes(domain);
}

/** Sends (or re-sends) the Microsoft invitation that creates the learner's account. */
async function inviteLearner(email, name) {
  return graph("POST", "/invitations", {
    invitedUserEmailAddress: email,
    invitedUserDisplayName: name || email.split("@")[0],
    inviteRedirectUrl: INVITE_REDIRECT,
    sendInvitationMessage: true,
    invitedUserMessageInfo: {
      customizedMessageBody:
        "Welcome to AI Academy! Accept this invitation to set up your account, then open the AI Academy app and choose Sign in with Microsoft using this email address.",
    },
  });
}

/** Whether the signed-in user is a guest (self-created) account we may delete. */
async function isDeletableGuest(userId) {
  const u = await graph("GET", `/users/${encodeURIComponent(userId)}?$select=id,userType`);
  return u?.userType === "Guest";
}

/** Removes everything we store for the learner (subscription transaction ownership is kept for accounting). */
async function deleteLearnerData(userId) {
  for (const name of USER_TABLES) {
    const table = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, name);
    try {
      for await (const e of table.listEntities({ queryOptions: { filter: odata`PartitionKey eq ${userId}`, select: ["partitionKey", "rowKey"] } })) {
        await table.deleteEntity(e.partitionKey, e.rowKey);
      }
    } catch (err) {
      if (err.statusCode !== 404) throw err;
    }
  }
  // US K–12 learner profiles, their progress and activity.
  await require("./k12/store").deleteAllForUser(userId);
}

async function deleteGuest(userId) {
  await graph("DELETE", `/users/${encodeURIComponent(userId)}`);
}

module.exports = { normaliseEmail, cleanName, isOrganisationEmail, inviteLearner, isDeletableGuest, deleteLearnerData, deleteGuest };
