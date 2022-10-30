const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
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
  whatPost,
  callback
) => {
  const docRef = db.collection("posts").doc(whatPost).collection("replies");
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

const deletePost = async (documentId, collectionPath) => {
  await db.collection(collectionPath).doc(documentId).delete();
};

const deleteComment = async (postDocumentId, replyDocumentId) => {
  await db
    .collection("posts")
    .doc(postDocumentId)
    .collection("replies")
    .doc(replyDocumentId)
    .delete();
};

// const readAllPost = async () => {
//   const docRef = db.collection("posts");
//   const snapshot = await docRef.get();

//   snapshot.forEach((posts) => {
//     callback = (data) => {
//       data = posts;
//       return data;
//     };
//     // console.log(
//     //   posts.id,
//     //   "=>",
//     //   posts._fieldsProto.post.stringValue,
//     //   "by: ",
//     //   posts._fieldsProto.publisher.stringValue
//     // );
//   });
//   // console.log(data);
//   // console.log(data.length);
// };

module.exports.writePost = writePost;
module.exports.addComment = addComment;
// module.exports.readAllPost = readAllPost;
module.exports.db = db;
module.exports.deletePost = deletePost;
module.exports.deleteComment = deleteComment;
