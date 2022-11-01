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
app.get("/writePost", async (req, res) => {
  await writePost(
    "Kurt",
    "This is a message",
    false,
    10,
    1,
    false,
    ["cet", "academic-break"],
    "academic-concerns",
    (postRes) => {
      res.send(postRes);
    }
  );
});

app.get("/writeComment", async (req, res) => {
  const postId = "DoYMdNkAOkFCEiNWIcQ2"; // get the post id from client
  await writeComment(
    "Kurt",
    "This is a reply",
    true,
    "academic-concerns",
    postId,
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
    data.push(post);
  });

  const snapshotPersonal = await docRefPersonalConcerns.get();
  snapshotPersonal.forEach((post) => {
    data.push(post);
  });

  const rankedData = async (data) => {
    console.log("total query: ", data.length);
    return data;
  };

  await rankedData(data)
    .then((result) => {
      // updateTimestamp();

      result.forEach((item) => {
        const timeNow = new Date(
          firebase.firestore.Timestamp.now().seconds * 1000
        );
        const dateConvert = new Date(
          item._fieldsProto.timeDate.timestampValue.seconds * 1000
        );

        const timeDiff = new Date((dateConvert - timeNow) * 1000);
        // TODO: Fix time difference
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
          timeDiff
        );
      });
      res.send(JSON.stringify(result.length));
    })

    .catch((err) => {
      res.send(err.message);
    });

  // TODO: Save data to the local storage in react
});

app.get("/deletePost", async (req, res) => {
  const postId = "p5tG9w8mwJnznAqnLeu2"; // get the post id from client
  const category = "academic-concerns";
  await deletePost(category, postId)
    .then(() => {
      res.send("A document with ID: " + postId + " has been deleted");
    })
    .catch((err) => {
      res.send(err.message);
    });
});

app.get("/deleteComment", async (req, res) => {
  const category = "academic-concerns";
  const postId = "DoYMdNkAOkFCEiNWIcQ2";
  const commentId = "7HnoINUYlpXS6udMgmvU";
  await deleteComment(category, postId, commentId)
    .then(() => {
      res.send("A document with ID: " + commentId + " has been deleted");
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
