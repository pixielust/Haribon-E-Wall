require("dotenv").config();
const firebase = require("firebase-admin");

const express = require("express");
const app = express();

const PORT = process.env.PORT;
const {
  writePost,
  db,
  deletePost,
  writeComment,
  deleteComment,
  updateTimestamp,
} = require("./firebase-config");

// console.log(process.env.DATABASE_URL);

//? write post ->
// http://localhost:3001/writePost/Kurt%20Jacob%20E.%20Urquico/hi%20message/true/academic-concerns?tags=cet%20test%20exam
app.get(
  "/writePost/:publisher/:message/:isAnonymous/:category",
  async (req, res) => {
    const tagList = req.query.tags.split(" ");
    await writePost(
      req.params.publisher,
      req.params.message,
      req.params.isAnonymous,
      0,
      0,
      false,
      tagList,
      req.params.category,
      (postRes) => {
        res.send(postRes);
      }
    );
  }
);

//? write comment ->
// http://localhost:3001/writeComment/true/kurt%20jacob%20urquico/academic-concerns?postId=2FAwOttAjc1lS2qzv3zO&message=hell
app.get("/writeComment/:isAnonymous/:commenter/:category", async (req, res) => {
  await writeComment(
    req.params.commenter,
    req.query.message,
    req.params.isAnonymous,
    req.params.category,
    req.query.postId,
    (comRes) => {
      res.send(comRes);
    }
  ).catch((err) => {
    res.send(err.message);
  });
});

app.get("/getAllPost", async (req, res) => {
  const data = [];
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

  const rankedData = async (data) => {
    data.forEach((item) => {
      const timeNow = new Date(
        firebase.firestore.Timestamp.now().seconds * 1000
      );
      const dateConvert = new Date(
        item._fieldsProto.timeDate.timestampValue.seconds * 1000
      );

      const hourDifference =
        (timeNow.getTime() - dateConvert.getTime()) / 1000 / 3600;

      const votePoint =
        (item._fieldsProto.upVote.integerValue -
          item._fieldsProto.downVote.integerValue -
          1) /
        Math.pow(hourDifference + 2, 1.5);
      item._fieldsProto.votePoint = votePoint;
      console.log(
        item._ref._path.segments.slice(-1)[0],
        " => ",
        item._fieldsProto.upVote.integerValue,
        " => ",
        item._fieldsProto.downVote.integerValue,
        " => ",
        dateConvert,
        " => ",
        timeNow,
        " => ",
        votePoint
      );
    });
    return data;
  };

  await rankedData(data)
    .then((result) => {
      res.send(JSON.stringify(result[0]));
    })
    .catch((err) => {
      res.send(err.message);
    });

  // TODO: Save data to the local storage in react
});

//? Delete Post ->
// http://localhost:3001/deletePost?category=academic-concerns&postId=wT0lUOQTxvfdM8C6iqxv
app.get("/deletePost", async (req, res) => {
  await deletePost(req.query.category, req.query.postId)
    .then(() => {
      res.send("A document with ID: " + req.query.postId + " has been deleted");
    })
    .catch((err) => {
      res.send(err.message);
    });
});

//? Delete Comment ->
// http://localhost:3001/deleteComment?category=academic-concerns&postId=DoYMdNkAOkFCEiNWIcQ2&commentId=4iGpiPHJZALtz0zl1Ill
app.get("/deleteComment", async (req, res) => {
  await deleteComment(req.query.category, req.query.postId, req.query.commentId)
    .then(() => {
      res.send(
        "A document with ID: " + req.query.commentId + " has been deleted"
      );
    })
    .catch((err) => {
      res.send(err.message);
    });
});

// TODO:
app.get("/getAllTags", async (req, res) => {});
app.get("/getAllPostsByTags", async (req, res) => {});
app.get("/getAllPostsByCategory", async (req, res) => {});
app.get("/upVote", async (req, res) => {});
app.get("/downVote", async (req, res) => {});
app.get("/get", async (req, res) => {});

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
