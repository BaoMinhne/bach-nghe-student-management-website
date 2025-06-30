const studentService = require("../models/student.model");
const JSend = require("../jsend");
const ApiError = require("../api-error");

/**
 * Lấy tất cả điểm của học viên theo mã học viên.
 *
 * @route GET /api/student/score
 * @param {import('express').Request} req - Request chứa query `studentCode`.
 * @param {import('express').Response} res - Response trả về điểm học viên.
 * @param {import('express').NextFunction} next - Middleware tiếp theo xử lý lỗi.
 */
async function getScore(req, res, next) {
  const studentCode = req.query.studentCode;

  if (!studentCode) {
    return next(new ApiError(400, "Student code is required"));
  }

  try {
    const score = await studentService.getAllSubjectScore(studentCode);

    if (!score) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(score));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid student code or data not found"));
  }
}

/**
 * Lấy điểm học viên theo học kỳ.
 *
 * @route GET /api/student/score/semester
 * @param {import('express').Request} req - Query gồm `studentCode` và `semester`.
 * @param {import('express').Response} res - Response trả về danh sách điểm theo học kỳ.
 * @param {import('express').NextFunction} next - Middleware tiếp theo xử lý lỗi.
 */
async function getScoreBySemester(req, res, next) {
  const { studentCode, semester } = req.query;

  if (!studentCode || !semester) {
    return next(new ApiError(400, "Student code and Semester is required"));
  }

  try {
    const score = await studentService.filterSubjectScoreBySemester(
      studentCode,
      semester
    );

    if (!score) {
      return next(new ApiError(401, "Data not found"));
    }

    if (score.length === 0) {
      return next(
        new ApiError(
          404,
          "The student don't have scores found in this semester"
        )
      );
    }

    return res.json(JSend.success(score));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid student code or data not found"));
  }
}

/**
 * Lấy thông tin học viên theo mã học viên.
 *
 * @route GET /api/student/info
 * @param {import('express').Request} req - Query chứa `studentCode`.
 * @param {import('express').Response} res - Response trả về thông tin học viên.
 * @param {import('express').NextFunction} next - Middleware tiếp theo xử lý lỗi.
 */
async function getStudentInfo(req, res, next) {
  const studentCode = req.query.studentCode;

  if (!studentCode) {
    return next(new ApiError(400, "Student code is required"));
  }

  try {
    const studentInfo = await studentService.getStudentInfo(studentCode);

    if (!studentInfo) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(studentInfo));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid student code or data not found"));
  }
}

/**
 * Cập nhật thông tin học viên.
 *
 * @route PUT /api/student/info
 * @param {import('express').Request} req - Query gồm `studentCode`, body chứa các trường thông tin cần cập nhật.
 * @param {import('express').Response} res - Response xác nhận cập nhật thành công.
 * @param {import('express').NextFunction} next - Middleware tiếp theo xử lý lỗi.
 */
async function updateStudentInfo(req, res, next) {
  const studentCode = req.query.studentCode;
  if (!studentCode) {
    return next(new ApiError(400, "Student code is required"));
  }

  const {
    student_date_of_birth,
    student_address,
    student_email,
    student_phone,
    student_IDCard,
    student_country,
    student_gender,
  } = req.body;

  if (
    !student_address ||
    !student_email ||
    !student_phone ||
    !student_IDCard ||
    !student_country
  ) {
    return next(new ApiError(400, "All fields are required"));
  }
  //   let dateOfBirth = null;
  //   if (student_date_of_birth) {
  //     dateOfBirth = moment(student_date_of_birth, "MM-DD-YYYY").format(
  //       "YYYY-MM-DD"
  //     );
  //   }

  const updateData = {
    student_date_of_birth,
    student_address,
    student_email,
    student_phone,
    student_IDCard,
    student_country,
    student_gender,
  };

  try {
    const updatedStudent = await studentService.updateStudentInfo(
      studentCode,
      updateData
    );
    if (!updatedStudent) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(updateData));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Infomation not valid or data not found"));
  }
}

/**
 * Lấy danh sách chứng chỉ của học viên.
 *
 * @route GET /api/student/certificates
 * @param {import('express').Request} req - Query chứa `studentCode`.
 * @param {import('express').Response} res - Response trả về danh sách chứng chỉ của học viên.
 * @param {import('express').NextFunction} next - Middleware tiếp theo xử lý lỗi.
 */
async function getCertificatesOfStudent(req, res, next) {
  const studentCode = req.query.studentCode;

  try {
    const listCerts = await studentService.getCertificatesOfStudent(
      studentCode
    );
    if (!listCerts) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(listCerts));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Infomation not valid or data not found"));
  }
}

module.exports = {
  getScore,
  getScoreBySemester,
  getStudentInfo,
  updateStudentInfo,
  getCertificatesOfStudent,
};
