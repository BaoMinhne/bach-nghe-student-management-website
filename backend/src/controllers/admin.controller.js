const adminService = require("../models/admin.model");
const JSend = require("../jsend");
const ApiError = require("../api-error");

// Account Management
/**
 * Tạo tài khoản học viên mới.
 * @route POST /api/admin/account/student
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware
 */
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

/**
 * Tạo tài khoản giảng viên mới.
 * @route POST /api/admin/account/teacher
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
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

/**
 * Lấy danh sách tài khoản học viên.
 * @route GET /api/admin/account/student
 */
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

/**
 * Lấy danh sách tất cả tài khoản người dùng (trừ admin).
 * @route GET /api/admin/account
 */
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

/**
 * Lấy danh sách tài khoản giảng viên.
 * @route GET /api/admin/account/teacher
 */
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

/**
 * Cập nhật thông tin tài khoản (mật khẩu hoặc trạng thái).
 * @route PUT /api/admin/account
 */
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

/**
 * Thêm danh sách tài khoản người dùng.
 * @route POST /api/admin/account/bulk
 */
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
/**
 * Lấy danh sách học viên.
 * @route GET /api/admin/student
 */
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

/**
 * Nhập danh sách học viên.
 * @route POST /api/admin/student/import
 */
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

/**
 * Lấy mã học viên cuối cùng.
 * @route GET /api/admin/student/last-code
 */
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

/**
 * Thêm học viên mới.
 * @route POST /api/admin/student
 */
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

/**
 * Cập nhật thông tin học viên.
 * @route PUT /api/admin/student
 */
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

/**
 * Lấy danh sách mã học viên chưa có tài khoản.
 * @route GET /api/admin/student/available-codes
 */
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

/**
 * Lấy danh sách học viên chưa trong lớp.
 * @route GET /api/admin/student/not-in-class?class_subject_id=...
 */
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

/**
 * Lấy danh sách học viên đã trong lớp.
 * @route GET /api/admin/student/in-class?class_subject_id=...
 */
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
/**
 * Lấy danh sách giảng viên.
 * @route GET /api/admin/teacher
 */
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

/**
 * Lấy mã giảng viên cuối cùng.
 * @route GET /api/admin/teacher/last-code
 */
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

/**
 * Thêm giảng viên mới.
 * @route POST /api/admin/teacher
 */
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

/**
 * Cập nhật thông tin giảng viên.
 * @route PUT /api/admin/teacher
 */
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

/**
 * Lấy danh sách mã giảng viên chưa có tài khoản.
 * @route GET /api/admin/teacher/available-codes
 */
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
/**
 * Tạo lớp học với giảng viên.
 * @route POST /api/admin/class
 */
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

/**
 * Thêm học viên vào lớp học.
 * @route POST /api/admin/class/add-students
 */
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

/**
 * Cập nhật thông tin lớp học.
 * @route PUT /api/admin/class
 */
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

/**
 * Lấy danh sách lớp và học kỳ tương ứng.
 * @route GET /api/admin/class/with-semester
 */
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
/**
 * Lấy danh sách lớp môn học.
 * @route GET /api/admin/module/list
 */
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

/**
 * Lấy danh sách tất cả module.
 * @route GET /api/admin/module/code
 */
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

/**
 * Lấy danh sách module có phân lớp.
 * @route GET /api/admin/module/filter
 */
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
/**
 * Lấy danh sách chứng chỉ theo lớp môn học.
 * @route GET /api/admin/certificate?class_subject_id=...
 */
async function getCertificates(req, res, next) {
  class_subject_id = req.query.class_subject_id;

  try {
    const listCertificate = await adminService.getCertificates(
      class_subject_id
    );

    if (!listCertificate) {
      return next(new ApiError(404, "Get fail"));
    }

    return res.status(200).json(JSend.success(listCertificate));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

/**
 * Lấy danh sách học viên đủ điều kiện cấp chứng chỉ.
 * @route GET /api/admin/certificate/eligible
 */
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

/**
 * Thêm chứng chỉ cho học viên.
 * @route POST /api/admin/certificate
 */
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

/**
 * Lấy danh sách lớp đã có chứng chỉ.
 * @route GET /api/admin/certificate/class-list
 */
async function getClassCert(req, res, next) {
  try {
    const listCertClass = await adminService.getClassCert();

    if (!listCertClass) {
      return next(new ApiError(404, "Get fail"));
    }

    return res.status(200).json(JSend.success(listCertClass));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

// Dash Board Admin
/**
 * Lấy thống kê tổng quan cho dashboard admin.
 * @route GET /api/admin/dashboard
 */
async function getDashboardStats(req, res, next) {
  try {
    const dashBoardStats = await adminService.getDashboardStats();

    if (!dashBoardStats) {
      return next(new ApiError(404, "Get fail"));
    }

    return res.status(200).json(JSend.success(dashBoardStats));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

/**
 * Lấy thống kê số lượng học viên theo lớp.
 * @route GET /api/admin/dashboard/student-in-class
 */
async function getCountStudentInClass(req, res, next) {
  try {
    const counts = await adminService.getCountStudentInClass();

    if (!counts) {
      return next(new ApiError(404, "Get fail"));
    }

    return res.status(200).json(JSend.success(counts));
  } catch (error) {
    console.error(error);
    return res.status(500).json(JSend.error("Internal server error", error));
  }
}

/**
 * Lấy thống kê học viên có chứng chỉ theo module.
 * @route GET /api/admin/dashboard/module-cert
 */
async function getModuleCertificateStats(req, res, next) {
  try {
    const counts = await adminService.getModuleCertificateStats();

    if (!counts) {
      return next(new ApiError(404, "Get fail"));
    }

    return res.status(200).json(JSend.success(counts));
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
  getClassCert,

  // DashBoard Admin
  getDashboardStats,
  getCountStudentInClass,
  getModuleCertificateStats,
};
