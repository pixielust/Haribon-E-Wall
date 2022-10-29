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

const serviceAccount = require("./haribon-e-wall-firebase-adminsdk-9q2vr-cdc71a0b9f.json");

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const writePost = async (publisher, post, time, isAnonymous, callback) => {
  const docRef = db.collection("posts").doc(publisher);
  await docRef
    .set({
      publisher: publisher,
      post: post,
      time: time,
      isAnonymous: isAnonymous,
    })
    .then(() => {
      callback();
    })
    .catch((error) => {
      return error;
    });
};

module.exports.writePost = writePost;
