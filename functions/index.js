/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onTaskDispatched} = require("firebase-functions/v2/tasks");


const {Database} = require("../app/backend/database");
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.deleteClass = onTaskDispatched(
    {
      retryConfig: {
        maxAttempts: 5,
        minBackoffSeconds: 60,
      },
    }, async (req) => {
      const classID = req.body.id.toString();
      const database = await Database.getDatabase();
      const ref = database.db.collection("classes").doc(classID);
      await ref.get();
      const _class = ref.data();
      _class.description += "Hello from firebase cloud functions";
      const ref2 = database.db.collection("classes").doc(classID);
      await ref2.set(_class);
    });
