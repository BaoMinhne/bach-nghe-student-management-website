const express = require("express");
const adminController = require("../controllers/admin.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");

const router = express.Router();

// Account Management
router.post("/createStudentAccount", adminController.createStudentAccount);
router.all("/createStudentAccount", methodNotAllowed);

router.post("/createTeacherAccount", adminController.createTeacherAccount);
router.all("/createTeacherAccount", methodNotAllowed);

router.get("/getAccountList", adminController.getAccountList);
router.all("/getAccountList", methodNotAllowed);

router.put("/updateAccount", adminController.updateAccount);
router.all("/updateAccount", methodNotAllowed);

router.post("/addNewAccount", adminController.addNewAccount);
router.all("/addNewAccount", methodNotAllowed);

router.get("/getStudentAccount", adminController.getStudentAccount);
router.all("/getStudentAccount", methodNotAllowed);

router.get("/getTeacherAccount", adminController.getTeacherAccount);
router.all("/getTeacherAccount", methodNotAllowed);

// Student Management

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

router.get("/getListStudentCode", adminController.getListStudentCode);
router.all("/getListStudentCode", methodNotAllowed);

router.get("/getStudentNotInClass", adminController.getStudentNotInClass);
router.all("/getStudentNotInClass", methodNotAllowed);

router.get("/getStudentInClass", adminController.getStudentInClass);
router.all("/getStudentInClass", methodNotAllowed);

// Teacher Management

router.get("/getTeacherList", adminController.getTeacherList);
router.all("/getTeacherList", methodNotAllowed);

router.get("/getLastTeacherCode", adminController.getLastTeacherCode);
router.all("/getLastTeacherCode", methodNotAllowed);

router.post("/addNewTeacher", adminController.addNewTeacher);
router.all("/addNewTeacher", methodNotAllowed);

router.put("/updateTeacherInfor", adminController.updateTeacherInfor);
router.all("/updateTeacherInfor", methodNotAllowed);

router.get("/getListTeacherCode", adminController.getListTeacherCode);
router.all("/getListTeacherCode", methodNotAllowed);

// Class & Enrollment
router.post("/createClass", adminController.createClassWithTeacher);
router.all("/createClass", methodNotAllowed);

router.post("/addStudentsToClass", adminController.addStudentsToClass);
router.all("/addStudentsToClass", methodNotAllowed);

router.put("/updateClass", adminController.updateClass);
router.all("/updateClass", methodNotAllowed);

router.get("/getClassCodeAndSemester", adminController.getClassCodeAndSemester);
router.all("/getClassCodeAndSemester", methodNotAllowed);

// Module Management
router.get("/getModuleList", adminController.getModuleList);
router.all("/getModuleList", methodNotAllowed);

router.get("/getModuleCode", adminController.getModuleCode);
router.all("/getModuleCode", methodNotAllowed);

router.get("/getModuleFilter", adminController.getModuleFilter);
router.all("/getModuleFilter", methodNotAllowed);

// Certificate Management
router.get("/getCertificates", adminController.getCertificates);
router.all("/getCertificates", methodNotAllowed);

router.get("/getStudentEligible", adminController.getStudentEligible);
router.all("/getStudentEligible", methodNotAllowed);

router.get("/getClassCert", adminController.getClassCert);
router.all("/getClassCert", methodNotAllowed);

router.post("/addCertificates", adminController.addCertificates);
router.all("/addCertificates", methodNotAllowed);

// Admin Dash Board
router.get("/getDashboardStats", adminController.getDashboardStats);
router.all("/getDashboardStats", methodNotAllowed);

router.get("/getCountStudentInClass", adminController.getCountStudentInClass);
router.all("/getCountStudentInClass", methodNotAllowed);

router.get(
  "/getModuleCertificateStats",
  adminController.getModuleCertificateStats
);
router.all("/getModuleCertificateStats", methodNotAllowed);

// Default
router.all("/", methodNotAllowed);

module.exports.setup = (app) => {
  app.use("/api/v1/admin", router);
};
