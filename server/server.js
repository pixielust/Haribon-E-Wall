require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const {
  writePost,
  db,
  deleteDocument,
  addComment,
  deleteComment,
} = require("./firebase-config");

// console.log(process.env.DATABASE_URL);
app.get("/writePost", async (req, res) => {
  await writePost("Kurt", "This is a message", false, (postRes) => {
    res.send(postRes);
  });
});

app.get("/addComment", async (req, res) => {
  await addComment(
    "Kurt",
    "This is a reply",
    false,
    "GN0MfmMsraDiW6sV4esv",
    (comRes) => {
      res.send(comRes);
    }
  ).catch((err) => {
    res.send(err.message);
  });
});

app.get("/readAllPost", async (req, res) => {
  const data = [];
  const docRef = db.collection("posts");
  const snapshot = await docRef.get();
  snapshot.forEach((post) => {
    data.push(post);
  });

  res.send(JSON.stringify(data));
  // TODO: Save data to the local storage
});

app.get("/deletePost", async (req, res) => {
  const id = "UfkvSuNGBcYuKGC9aOAV";
  await deleteDocument(id, "posts")
    .then(() => {
      res.send("A document with ID: " + id + " has been deleted");
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

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
