const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const firebase = require("firebase-admin");
const { someBadWords } = require("./someBadWords");
const Filter = require("bad-words"),
  filter = new Filter({
    regex: /\*|\.|$/gi,
    replaceRegex: /[A-Za-z0-9가-힣_]/g,
  });
filter.addWords(...someBadWords);

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
  email,
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
      email: email,
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
  email,
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
      email: email,
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

const rankedData = async (data) => {
  data.forEach((item) => {
    const timeNow = new Date(firebase.firestore.Timestamp.now().seconds * 1000);
    const dateConvert = new Date(
      item._fieldsProto.timeDate.timestampValue.seconds * 1000
    );

    //! Reddit Algorithm: https://moz.com/blog/reddit-stumbleupon-delicious-and-hacker-news-algorithms-exposed
    const secondsDifference = // ts
      (timeNow.getTime() - dateConvert.getTime()) / 1000;
    let votePoint = // x
      item._fieldsProto.upVote.integerValue -
      item._fieldsProto.downVote.integerValue;
    let yValue = 0;
    let zValue = 0;

    if (votePoint > 0) {
      yValue = 1;
    } else if ((votePoint = 0)) {
      yValue = 0;
    } else {
      yValue = -1;
    }

    if (Math.abs(votePoint) >= 1) {
      zValue = Math.abs(votePoint);
    } else {
      zValue = 1;
    }

    const rating =
      Math.log10(zValue) + (yValue * parseInt(secondsDifference, 10)) / 45000;

    //! filter profanities
    item._fieldsProto.message.stringValue = filter.clean(
      item._fieldsProto.message.stringValue
    );
    item._fieldsProto.rating = rating;
  });

  data.sort(
    //? sort data, descending
    (a, b) => (a._fieldsProto.rating < b._fieldsProto.rating ? 1 : -1)
  );

  return data;
};

const getAllData = async (data) => {
  const docRefAcademicConcerns = db
    .collection("categories")
    .doc("academic-concerns")
    .collection("posts");

  const docRefPersonalConcerns = db
    .collection("categories")
    .doc("personal-concerns")
    .collection("posts");

  const snapshotAcademic = await docRefAcademicConcerns.get();
  snapshotAcademic.forEach((post) => {
    // data["votePoint"] = 0;
    data.push(post);
  });

  const snapshotPersonal = await docRefPersonalConcerns.get();
  snapshotPersonal.forEach((post) => {
    // data["votePoint"] = 0;
    data.push(post);
  });

  return data;
};

module.exports.writePost = writePost;
module.exports.writeComment = writeComment;
// module.exports.readAllPost = readAllPost;
module.exports.db = db;
module.exports.deletePost = deletePost;
module.exports.deleteComment = deleteComment;
module.exports.rankedData = rankedData;
module.exports.getAllData = getAllData;
// module.exports.updateTimestamp = updateTimestamp;
