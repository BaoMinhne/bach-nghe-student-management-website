const express = require("express");
const teacherController = require("../controllers/teacher.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
// const authorization = require("../middlewares/authorization");

const router = express.Router();

router.get("/getTeacherInfo", teacherController.getTeacherInfo);
router.all("/getTeacherInfo", methodNotAllowed);
router.put("/updateTeacherInfo", teacherController.updateTeacherInfo);
router.all("/updateTeacherInfo", methodNotAllowed);

router.all("/", methodNotAllowed);

module.exports.setup = (app) => {
  app.use("/api/v1/teacher", router);
};
