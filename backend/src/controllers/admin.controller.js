const adminService = require("../models/admin.model");
const JSend = require("../jsend");
const ApiError = require("../api-error");
const { as } = require("../database/knex");

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

async function getAccountList(req, res, next) {
  try {
    const users = await adminService.getAccountList();
    if (!users) {
      return next(new ApiError(404, "No user accounts found"));
    }
    return res.status(200).json(JSend.success(users));
  } catch (err) {
    console.error(err);
    return res.status(500).json(JSend.error("Internal server error", err));
  }
}

async function getTeacherAccount(req, res, next) {
  try {
    const users = await adminService.getTeacherAccount();
    if (!users) {
      return next(new ApiError(404, "No user accounts found"));
    }
    return res.status(200).json(JSend.success(users));
  } catch (err) {
    console.error(err);
    return res.status(500).json(JSend.error("Internal server error", err));
  }
}

async function createClassWithTeacher(req, res, next) {
  const { classID, moduleID, semesterID, teacherCode } = req.body;

  if (!classID || !moduleID || !semesterID || !teacherCode) {
    return res.status(400).json(JSend.fail("All fields are required"));
  }

  try {
    const newClass = await adminService.createClassWithTeacher({
      classID,
      moduleID,
      semesterID,
      teacherCode,
    });

    if (!newClass) {
      return next(new ApiError(401, "Create class failed"));
    }

    return res.status(201).json(JSend.success(newClass));
  } catch (err) {
    console.error(err);
    return res.status(500).json(JSend.error("Internal server error", err));
  }
}

async function addStudentsToClass(req, res, next) {
  const { class_subject_id, student_codes } = req.body;

  if (
    typeof class_subject_id === "undefined" ||
    class_subject_id === null ||
    !Array.isArray(student_codes) ||
    student_codes.length === 0
  ) {
    return res.status(400).json(JSend.fail("Missing or invalid data"));
  }

  try {
    const result = await adminService.addStudentsToClass({
      class_subject_id,
      student_codes,
    });

    return res.status(201).json(JSend.success({ added: result }));
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, "Internal server error"));
  }
}

async function updateAccount(req, res, next) {
  const { currentCode, newPassword, newStatus } = req.body;

  if (!currentCode || newPassword === undefined || isNaN(newStatus)) {
    return res.status(400).json(JSend.fail("Invalid input"));
  }

  try {
    const updatedUser = await adminService.updateAccount({
      currentCode,
      newPassword,
      newStatus,
    });

    if (!updatedUser) {
      return next(new ApiError(404, "Account not found"));
    }

    return res.status(200).json(JSend.success(updatedUser));
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
  createClassWithTeacher,
  addStudentsToClass,
  getAccountList,
  updateAccount,
};
