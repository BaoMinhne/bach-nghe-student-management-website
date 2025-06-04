const adminService = require("../models/admin.model");
const JSend = require("../jsend");
const ApiError = require("../api-error");

async function createStudentAccount(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json(JSend.fail("All fields are required"));
  }

  try {
    // Kiểm tra tài khoản đã tồn tại
    const existing = await adminService.checkUserAccount(username);
    if (existing) {
      return res.status(400).json(JSend.fail("Account already exists"));
    }

    const student = await adminService.createStudentAccount({
      username,
      password,
    });

    if (!student) {
      return next(new ApiError(401, "Create account failed"));
    }

    return res.status(201).json(JSend.success(student));
  } catch (err) {
    console.error(err);
    return res.status(500).json(JSend.error("Internal server error", err));
  }
}

async function createTeacherAccount(req, res, next) {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json(JSend.fail("All fields are required"));
  }

  try {
    // Kiểm tra tài khoản đã tồn tại
    const existing = await adminService.checkUserAccount(username);
    if (existing) {
      return res.status(400).json(JSend.fail("Account already exists"));
    }

    const teacher = await adminService.createTeacherAccount({
      username,
      password,
    });

    if (!teacher) {
      return next(new ApiError(401, "Create account failed"));
    }

    return res.status(201).json(JSend.success(teacher));
  } catch (err) {
    console.error(err);
    return res.status(500).json(JSend.error("Internal server error", err));
  }
}

async function getStudentAccount(req, res, next) {
  try {
    const students = await adminService.getStudentAccount();
    if (!students) {
      return next(new ApiError(404, "No student accounts found"));
    }
    return res.status(200).json(JSend.success(students));
  } catch (err) {
    console.error(err);
    return res.status(500).json(JSend.error("Internal server error", err));
  }
}

async function getTeacherAccount(req, res, next) {
  try {
    const students = await adminService.getTeacherAccount();
    if (!students) {
      return next(new ApiError(404, "No student accounts found"));
    }
    return res.status(200).json(JSend.success(students));
  } catch (err) {
    console.error(err);
    return res.status(500).json(JSend.error("Internal server error", err));
  }
}

module.exports = {
  createStudentAccount,
  createTeacherAccount,
  getStudentAccount,
  getTeacherAccount,
};
