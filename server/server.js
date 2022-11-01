require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const {
  writePost,
  db,
  deletePost,
  addComment,
  deleteComment,
  rankData,
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

app.get("/addComment", async (req, res) => {
  const postId = "p5tG9w8mwJnznAqnLeu2"; // get the post id from client
  await addComment(
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

  const snapshotAcad = await docRefAcademicConcerns.get();
  snapshotAcad.forEach((post) => {
    data.push(post);
  });

  const snapshotPersonal = await docRefPersonalConcerns.get();
  snapshotPersonal.forEach((post) => {
    data.push(post);
  });

  rankData(data)
    .then(() => {
      res.send(JSON.stringify(data.length));
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
  const postId = "GN0MfmMsraDiW6sV4esv";
  const commentId = "R8V3uaa5Ycr9BmTfnOLC";
  await deleteComment(postId, commentId)
    .then(() => {
      res.send("A document with ID: " + commentId + " has been deleted");
    })
    .catch((err) => {
      res.send(err.message);
    });
});

// TODO:
app.get("/getAllTagsByPopularity", async (req, res) => {});
app.get("/upVote", async (req, res) => {});
app.get("/downVote", async (req, res) => {});
app.get("/get", async (req, res) => {});

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
