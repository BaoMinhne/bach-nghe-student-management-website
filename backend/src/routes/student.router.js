const express = require("express");
const studentController = require("../controllers/student.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
// const authorization = require("../middlewares/authorization");

const router = express.Router();

router.get("/getScore", studentController.getScore);
router.all("/getScore", methodNotAllowed);
router.get("/getScoreBySemester", studentController.getScoreBySemester);
router.all("/getScoreBySemester", methodNotAllowed);
router.get("/getStudentInfo", studentController.getStudentInfo);
router.all("/getStudentInfo", methodNotAllowed);
router.put("/updateStudentInfo", studentController.updateStudentInfo);
router.all("/updateStudentInfo", methodNotAllowed);

router.all("/", methodNotAllowed);

module.exports.setup = (app) => {
  app.use("/api/v1/student", router);
};
