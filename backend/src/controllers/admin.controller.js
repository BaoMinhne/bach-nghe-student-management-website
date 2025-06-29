const adminService = require("../models/admin.model");
const JSend = require("../jsend");
const ApiError = require("../api-error");

// Account Management
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

async function addNewAccount(req, res, next) {
  const datas = req.body;

  if (!datas || !Array.isArray(datas)) {
    return res.status(400).json(JSend.fail("Invalid input"));
  }

  try {
    const listAccount = await adminService.addNewAccount(datas);

    if (!listAccount) {
      return next(new ApiError(404, "Insert fail"));
    }

    return res.status(200).json(JSend.success(listAccount));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

// Student Management
async function getStudentList(req, res, next) {
  try {
    const students = await adminService.getStudentList();

    if (!students) {
      return next(new ApiError(404, "Don't have any data"));
    }

    return res.status(200).json(JSend.success(students));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function importStudentList(req, res, next) {
  const payload = req.body;

  if (!payload || !Array.isArray(payload)) {
    return res.status(400).json(JSend.fail("Invalid input"));
  }

  try {
    const studentList = await adminService.importStudentList(payload);

    if (!studentList) {
      return next(new ApiError(404, "Insert fail"));
    }

    return res.status(200).json(JSend.success(studentList));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function getLastStudentCode(req, res, next) {
  try {
    const studentCode = await adminService.getLastStudentCode();

    if (!studentCode) {
      return next(new ApiError(404, "Don't have any data"));
    }

    return res.status(200).json(JSend.success(studentCode));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function addNewStudent(req, res, next) {
  const student = req.body;

  if (!student) {
    return res.status(400).json(JSend.fail("Invalid input"));
  }

  try {
    const newStudent = await adminService.addNewStudent(student);

    if (!newStudent) {
      return next(new ApiError(404, "Insert fail"));
    }

    return res.status(200).json(JSend.success(newStudent));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function updateStudentInfor(req, res, next) {
  const student = req.body;

  if (!student) {
    return next(new ApiError(404, "Don't have any data"));
  }

  try {
    const studentUpdate = await adminService.updateStudentInfor(student);

    if (!studentUpdate) {
      return next(new ApiError(404, "Don't have any data"));
    }

    return res.status(200).json(JSend.success(studentUpdate));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(JSend.error("Internal server error", error.message));
  }
}

async function getListStudentCode(req, res, next) {
  try {
    const studentCode = await adminService.getListStudentCode();

    if (!studentCode) {
      return next(new ApiError(404, "Don't have any data"));
    }

    return res.status(200).json(JSend.success(studentCode));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function getStudentNotInClass(req, res, next) {
  const class_subject_id = req.query.class_subject_id;
  try {
    const listStudent = await adminService.getStudentNotInClass(
      class_subject_id
    );

    if (!listStudent) {
      return next(new ApiError(404, "update fail"));
    }

    return res.status(200).json(JSend.success(listStudent));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function getStudentInClass(req, res, next) {
  const class_subject_id = req.query.class_subject_id;
  try {
    const listStudent = await adminService.getStudentInClass(class_subject_id);

    if (!listStudent) {
      return next(new ApiError(404, "update fail"));
    }

    return res.status(200).json(JSend.success(listStudent));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

// Teacher Management

async function getTeacherList(req, res, next) {
  try {
    const teachers = await adminService.getTeacherList();

    if (!teachers) {
      return next(new ApiError(404, "Don't have any data"));
    }

    return res.status(200).json(JSend.success(teachers));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function getLastTeacherCode(req, res, next) {
  try {
    const teacherCode = await adminService.getLastTeacherCode();

    if (!teacherCode) {
      return next(new ApiError(404, "Don't have any data"));
    }

    return res.status(200).json(JSend.success(teacherCode));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function addNewTeacher(req, res, next) {
  const teacher = req.body;

  if (!teacher) {
    return res.status(400).json(JSend.fail("Invalid input"));
  }

  try {
    const newTeacher = await adminService.addNewTeacher(teacher);

    if (!newTeacher) {
      return next(new ApiError(404, "Insert fail"));
    }

    return res.status(200).json(JSend.success(newTeacher));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function updateTeacherInfor(req, res, next) {
  const teacher = req.body;

  if (!teacher) {
    return next(new ApiError(404, "Don't have any data"));
  }

  try {
    const teacherUpdate = await adminService.updateTeacherInfor(teacher);

    if (!teacherUpdate) {
      return next(new ApiError(404, "Don't have any data"));
    }

    return res.status(200).json(JSend.success(teacherUpdate));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(JSend.error("Internal server error", error.message));
  }
}

async function getListTeacherCode(req, res, next) {
  try {
    const teacherCode = await adminService.getListTeacherCode();

    if (!teacherCode) {
      return next(new ApiError(404, "Don't have any data"));
    }

    return res.status(200).json(JSend.success(teacherCode));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

// Class & Enrollment

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

async function updateClass(req, res, next) {
  const payload = req.body;

  if (!payload) {
    return res.status(400).json(JSend.fail("Invalid input"));
  }

  try {
    const updateData = await adminService.updateClass(payload);

    if (!updateData) {
      return next(new ApiError(404, "update fail"));
    }

    return res.status(200).json(JSend.success(updateData));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function getClassCodeAndSemester(req, res, next) {
  try {
    const listClassWithSemester = await adminService.getClassCodeAndSemester();

    if (!listClassWithSemester) {
      return next(new ApiError(404, "Insert fail"));
    }

    return res.status(200).json(JSend.success(listClassWithSemester));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

// Module Management

async function getModuleList(req, res, next) {
  try {
    const listModule = await adminService.getModuleList();

    if (!listModule) {
      return next(new ApiError(404, "Insert fail"));
    }

    return res.status(200).json(JSend.success(listModule));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function getModuleCode(req, res, next) {
  try {
    const listModule = await adminService.getModuleCode();

    if (!listModule) {
      return next(new ApiError(404, "Get fail"));
    }

    return res.status(200).json(JSend.success(listModule));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function getModuleFilter(req, res, next) {
  try {
    const listModule = await adminService.getModuleFilter();

    if (!listModule) {
      return next(new ApiError(404, "Get fail"));
    }

    return res.status(200).json(JSend.success(listModule));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

// Certificate Management
async function getCertificates(req, res, next) {
  try {
    const listCertificate = await adminService.getCertificates();

    if (!listCertificate) {
      return next(new ApiError(404, "Get fail"));
    }

    return res.status(200).json(JSend.success(listCertificate));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function getStudentEligible(req, res, next) {
  try {
    const studentList = await adminService.getStudentEligible();

    if (!studentList) {
      return next(new ApiError(404, "Get fail"));
    }

    return res.status(200).json(JSend.success(studentList));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

async function addCertificates(req, res, next) {
  const { class_subject_id, student_codes } = req.body;

  try {
    const addCert = await adminService.addCertificates({
      class_subject_id,
      student_codes,
    });

    if (!addCert) {
      return next(new ApiError(404, "Add fail"));
    }

    return res.status(200).json(JSend.success(addCert));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

module.exports = {
  // Account Management
  createStudentAccount,
  createTeacherAccount,
  addNewAccount,
  getAccountList,
  updateAccount,
  getTeacherAccount,
  getStudentAccount,

  // Student Management
  getStudentList,
  getLastStudentCode,
  addNewStudent,
  updateStudentInfor,
  importStudentList,
  getListStudentCode,
  getStudentInClass,
  getStudentNotInClass,

  // Teacher Management
  getTeacherList,
  getLastTeacherCode,
  addNewTeacher,
  updateTeacherInfor,
  getListTeacherCode,

  // Class & Enrollment
  createClassWithTeacher,
  updateClass,
  addStudentsToClass,
  getClassCodeAndSemester,

  // Module Management
  getModuleList,
  getModuleCode,
  getModuleFilter,

  // Certificate Management
  getCertificates,
  getStudentEligible,
  addCertificates,
};
