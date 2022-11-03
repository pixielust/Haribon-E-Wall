require("dotenv").config();
const firebase = require("firebase-admin");

const express = require("express");
const app = express();

const Filter = require("bad-words"),
  filter = new Filter({
    regex: /\*|\.|$/gi,
    replaceRegex: /[A-Za-z0-9가-힣_]/g,
  });

const PORT = process.env.PORT;
const { someBadWords } = require("./someBadWords");
const {
  writePost,
  db,
  deletePost,
  writeComment,
  deleteComment,
  rankedData,
  getAllData,
} = require("./firebase-config");

filter.addWords(...someBadWords);

// console.log(process.env.DATABASE_URL);

//? write post ->
// http://localhost:3001/writePost/Kurt%20Jacob%20E.%20Urquico/hi%20message/true/academic-concerns/kjeu2020@plm.edu.ph?tags=cet%20test%20exam
app.get(
  "/writePost/:publisher/:message/:isAnonymous/:category/:email",
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
      req.params.email,
      req.params.category,
      (postRes) => {
        res.send(postRes);
      }
    );
  }
);

//? write comment ->
// http://localhost:3001/writeComment/true/kurt%20jacob%20urquico/academic-concerns/kjeu@plm.edu.ph?postId=2FAwOttAjc1lS2qzv3zO&message=hell
app.get(
  "/writeComment/:isAnonymous/:commenter/:category/:email",
  async (req, res) => {
    await writeComment(
      req.params.commenter,
      req.query.message,
      req.params.isAnonymous,
      req.params.category,
      req.query.postId,
      req.params.email,
      (comRes) => {
        res.send(comRes);
      }
    ).catch((err) => {
      res.send(err.message);
    });
  }
);

//? get All posts
//? this endpoint can be used in getting ranked posts from categories and tags
app.get("/getAllPost", async (req, res) => {
  const data = [];
  await getAllData(data);
  await rankedData(data)
    .then((result) => {
      // now returns a sorted ranked data
      res.send(JSON.stringify(result));
      result.forEach((item) => {
        console.log(
          item._ref._path.segments.slice(-1)[0],
          " => ",
          item._fieldsProto.upVote.integerValue,
          " => ",
          item._fieldsProto.downVote.integerValue,
          " => ",
          item._fieldsProto.rating,
          " => ",
          item._fieldsProto.message.stringValue,
          " => ",
          item._fieldsProto.email.stringValue
        );
      });
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
//? getAllPostsByTags, and getAllPostsByCategory are sub endpoints from getAllPosts
//? getAllPostsByTags => only presents the post with specific user-selected tag, filter data so that there is no repeating tags
//? getAllPostByCategory => only presents the post with specific category

app.get("/getAllTags", async (req, res) => {
  const data = [];
  const tags = [];
  const countTag = {};
  await getAllData(data);
  await rankedData(data)
    .then((result) => {
      // now returns a sorted ranked data
      for (let i = 0; i < result.length; i++) {
        for (
          let j = 0;
          j < result[i]._fieldsProto.tags.arrayValue.values.length;
          j++
        ) {
          tags.push(
            result[i]._fieldsProto.tags.arrayValue.values[j].stringValue
          );
        }
      }
      tags.forEach((tag) => {
        countTag[tag] = (countTag[tag] || 0) + 1;
      });
      res.send(JSON.stringify(countTag));
    })
    .catch((err) => {
      res.send(err.message);
    });
});
app.get("/upVote", async (req, res) => {});
app.get("/downVote", async (req, res) => {});
app.get("/get", async (req, res) => {});

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
