require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const { writePost } = require("./firebase-config");

// console.log(process.env.DATABASE_URL);
app.get("/", (req, res) => {
  writePost("Kurt", "This is a message", false, (message) => {
    return res.send(message);
  });
});

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
