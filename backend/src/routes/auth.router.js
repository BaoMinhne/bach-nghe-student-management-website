const express = require("express");
const authController = require("../controllers/auth.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
// const authorization = require("../middlewares/authorization");

const router = express.Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.all("/", methodNotAllowed);

module.exports.setup = (app) => {
  app.use("/api/v1/auth", router);
};
