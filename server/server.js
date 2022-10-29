require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const db = require("./firebase-config");

// console.log(process.env.DATABASE_URL);
app.get("/", (req, res) => {
  return res.send(db);
});

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
