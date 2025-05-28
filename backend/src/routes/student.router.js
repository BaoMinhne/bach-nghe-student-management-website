const express = require("express");
const studentController = require("../controllers/student.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
// const authorization = require("../middlewares/authorization");

const router = express.Router();

router.get("/getScore", studentController.getScore);
router.all("/getScore", methodNotAllowed);
router.get("/getScoreBySemester", studentController.getScoreBySemester);

router.all("/", methodNotAllowed);

module.exports.setup = (app) => {
  app.use("/api/v1/student", router);
};
