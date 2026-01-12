const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK. This will use the default service
// account when deployed to Firebase. When testing locally, you may
// provide a service account key via the GOOGLE_APPLICATION_CREDENTIALS
// environment variable.
admin.initializeApp();

/**
 * Callable function for setting a custom role on a user. Only users with
 * the `admin` role in their authentication token are allowed to call this
 * function. The role will be stored as a custom claim on the user record.
 *
 * To invoke from the client, use:
 *   const setRole = firebase.functions().httpsCallable('setUserRole');
 *   await setRole({ uid: '<UID>', role: 'moderator' });
 */
exports.setUserRole = functions.https.onCall(async (data, context) => {
  // Verify that the request is authenticated and the caller is an admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const callerRole = context.auth.token.role;
  if (callerRole !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can assign roles.');
  }
  const { uid, role } = data;
  if (!uid || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'Both uid and role are required.');
  }
  // Set the custom claim on the target user
  await admin.auth().setCustomUserClaims(uid, { role });
  return { success: true, message: `Role for user ${uid} set to ${role}` };
});

/**
 * Callable function for retrieving a list of users. Only admins or
 * moderators can call this function. The function returns an array of
 * user summaries with uid and claims so that the client can display
 * them in the admin interface.
 */
exports.listUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const callerRole = context.auth.token.role;
  if (callerRole !== 'admin' && callerRole !== 'moderator') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins or moderators can list users.');
  }
  const maxResults = data.maxResults || 100;
  const list = await admin.auth().listUsers(maxResults);
  // Map to a lightweight object
  const users = list.users.map((userRecord) => ({
    uid: userRecord.uid,
    email: userRecord.email,
    displayName: userRecord.displayName,
    role: userRecord.customClaims && userRecord.customClaims.role ? userRecord.customClaims.role : 'jobSeeker'
  }));
  return { users };
});