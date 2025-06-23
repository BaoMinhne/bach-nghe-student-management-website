const express = require("express");
const adminController = require("../controllers/admin.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");

const router = express.Router();

router.post("/createStudentAccount", adminController.createStudentAccount);
router.all("/createStudentAccount", methodNotAllowed);
router.post("/createTeacherAccount", adminController.createTeacherAccount);
router.all("/createTeacherAccount", methodNotAllowed);
router.get("/getStudentAccount", adminController.getStudentAccount);
router.all("/getStudentAccount", methodNotAllowed);
router.get("/getTeacherAccount", adminController.getTeacherAccount);
router.all("/getTeacherAccount", methodNotAllowed);
router.post("/createClass", adminController.createClassWithTeacher);
router.all("/createClass", methodNotAllowed);
router.post("/addStudentsToClass", adminController.addStudentsToClass);
router.all("/addStudentsToClass", methodNotAllowed);
router.get("/getAccountList", adminController.getAccountList);
router.all("/getAccountList", methodNotAllowed);
router.put("/updateAccount", adminController.updateAccount);
router.all("/updateAccount", methodNotAllowed);
router.get("/getStudentList", adminController.getStudentList);
router.all("/getStudentList", methodNotAllowed);
router.post("/importStudentList", adminController.importStudentList);
router.all("/importStudentList", methodNotAllowed);
router.get("/getLastStudentCode", adminController.getLastStudentCode);
router.all("/getLastStudentCode", methodNotAllowed);
router.post("/addNewStudent", adminController.addNewStudent);
router.all("/addNewStudent", methodNotAllowed);
router.put("/updateStudentInfor", adminController.updateStudentInfor);
router.all("/updateStudentInfor", methodNotAllowed);

router.all("/", methodNotAllowed);

module.exports.setup = (app) => {
  app.use("/api/v1/admin", router);
};
