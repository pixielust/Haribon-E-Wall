const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const firebase = require("firebase-admin");

const serviceAccount = require("./haribon-e-wall-firebase-adminsdk-9q2vr-cdc71a0b9f.json");

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

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
    .then(() => {
      res = "Success";
    })
    .catch((err) => {
      res = err.message;
    });
  callback(res);
};

const addComment = async (
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

const deleteComment = async (postDocumentId, replyDocumentId) => {
  await db
    .collection("posts")
    .doc(postDocumentId)
    .collection("replies")
    .doc(replyDocumentId)
    .delete();
};

const rankData = async (data) => {
  // TODO: use reddit algorithm
  return data;
};

module.exports.writePost = writePost;
module.exports.addComment = addComment;
// module.exports.readAllPost = readAllPost;
module.exports.db = db;
module.exports.deletePost = deletePost;
module.exports.deleteComment = deleteComment;
module.exports.rankData = rankData;
