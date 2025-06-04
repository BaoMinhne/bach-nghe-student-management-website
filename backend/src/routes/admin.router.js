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

router.all("/", methodNotAllowed);

module.exports.setup = (app) => {
  app.use("/api/v1/admin", router);
};
