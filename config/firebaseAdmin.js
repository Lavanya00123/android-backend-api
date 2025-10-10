// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json"); // download JSON from Firebase console

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;


const admin = require("firebase-admin");


// ✅ Load service account JSON
const serviceAccount = require("./serviceAccountKey.json"); // ✅ path to JSON you downloaded from Firebase console

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized");
}

module.exports = admin;
