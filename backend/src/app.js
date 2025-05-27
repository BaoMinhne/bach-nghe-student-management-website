const express = require("express");
const cors = require("cors");
const JSend = require("./jsend");

const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json(JSend.success());
});

app.use("/public", express.static("public"));

//handle 404 response
app.use(resourceNotFound);

app.use(handleError);

module.exports = app;
