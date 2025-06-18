const express = require("express");
const teacherController = require("../controllers/teacher.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
// const authorization = require("../middlewares/authorization");

const router = express.Router();

router.get("/getTeacherInfo", teacherController.getTeacherInfo);
router.all("/getTeacherInfo", methodNotAllowed);
router.put("/updateTeacherInfo", teacherController.updateTeacherInfo);
router.all("/updateTeacherInfo", methodNotAllowed);
router.get("/getModuleTeaching", teacherController.getModuleTeaching);
router.all("/getModuleTeaching", methodNotAllowed);
router.get("/getStudentInClass", teacherController.getStudentInClass);
router.all("/getStudentInClass", methodNotAllowed);
router.put("/updateStudentScore", teacherController.updateStudentScore);
router.all("/updateStudentScore", methodNotAllowed);
router.get("/getStudentPassing", teacherController.getStudentPassing);
router.all("/getStudentPassing", methodNotAllowed);
router.get("/getPassingPropotion", teacherController.getPassingPropotion);
router.all("/getPassingPropotion", methodNotAllowed);
router.get("/getAvgScore", teacherController.getAvgScore);
router.all("/getAvgScore", methodNotAllowed);
router.get("/getStudentCodeByName", teacherController.getStudentCodeByName);
router.all("/getStudentCodeByName", methodNotAllowed);
router.post("/importStudentScores", teacherController.importStudentScores);
router.all("/importStudentScores", methodNotAllowed);
router.get("/getScoreProgress", teacherController.getScoreProgress);
router.all("/getScoreProgress", methodNotAllowed);
router.get("/getCountTeaching", teacherController.getCountTeaching);
router.all("/getCountTeaching", methodNotAllowed);
router.get("/getLastUpdate", teacherController.getLastUpdate);
router.all("/getLastUpdate", methodNotAllowed);

router.all("/", methodNotAllowed);

module.exports.setup = (app) => {
  app.use("/api/v1/teacher", router);
};
