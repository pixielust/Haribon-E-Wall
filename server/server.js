require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const { writePost } = require("./firebase-config");

// console.log(process.env.DATABASE_URL);
app.get("/", (req, res) => {
  writeState = "failed";
  writePost("Kurt1", "This is a message", "time", false, () => {
    writeState = "success";
    return res.send(writeState);
  });
});

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
