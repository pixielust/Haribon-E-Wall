const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const firebase = require("firebase-admin");

const serviceAccount = require("./haribon-e-wall-firebase-adminsdk-9q2vr-cdc71a0b9f.json");

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const writePost = async (publisher, post, isAnonymous, callback) => {
  const docRef = db.collection("posts");
  await docRef
    .add({
      publisher: publisher,
      post: post,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      isAnonymous: isAnonymous,
    })
    .then(() => {
      message = "success";
    })
    .catch((error) => {
      message = "failed";
    });
  callback(message);
};

module.exports.writePost = writePost;
