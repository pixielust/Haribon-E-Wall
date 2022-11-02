const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, updateDoc } = require("firebase-admin/firestore");
const firebase = require("firebase-admin");

const serviceAccount = require("./haribon-e-wall-firebase-adminsdk-9q2vr-cdc71a0b9f.json");

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// const updateTimestamp = async () => {
//   const docRef = doc(db, "objects", "some-id");
//   await updateDoc(docRef, {
//     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//   });
// };

const writePost = async (
  publisher,
  message,
  isAnonymous,
  upVote,
  downVote,
  isSolved,
  tags,
  category,
  callback
) => {
  const docRef = db.collection("categories").doc(category).collection("posts");
  await docRef
    .add({
      publisher: publisher,
      message: message,
      timeDate: firebase.firestore.FieldValue.serverTimestamp(),
      isAnonymous: isAnonymous,
      upVote: upVote,
      downVote: downVote,
      isSolved: isSolved,
      tags: tags,
    })
    .then((result) => {
      res = result;
    })
    .catch((err) => {
      res = err.message;
    });
  callback(res);
};

const writeComment = async (
  commenter,
  reply,
  isAnonymous,
  category,
  post,
  callback
) => {
  const docRef = db
    .collection("categories")
    .doc(category)
    .collection("posts")
    .doc(post)
    .collection("replies");
  await docRef
    .add({
      commenter: commenter,
      reply: reply,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      isAnonymous: isAnonymous,
    })
    .then(() => {
      res = "Success";
    })
    .catch((err) => {
      res = err.message;
    });
  callback(res);
};

const deletePost = async (category, post) => {
  await db
    .collection("categories")
    .doc(category)
    .collection("posts")
    .doc(post)
    .delete();
};

const deleteComment = async (category, post, reply) => {
  await db
    .collection("categories")
    .doc(category)
    .collection("posts")
    .doc(post)
    .collection("replies")
    .doc(reply)
    .delete();
};

module.exports.writePost = writePost;
module.exports.writeComment = writeComment;
// module.exports.readAllPost = readAllPost;
module.exports.db = db;
module.exports.deletePost = deletePost;
module.exports.deleteComment = deleteComment;
// module.exports.updateTimestamp = updateTimestamp;
