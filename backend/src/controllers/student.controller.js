const studentService = require("../models/student.model");
const JSend = require("../jsend");
const ApiError = require("../api-error");

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

module.exports = {
  getScore,
  getScoreBySemester,
  getStudentInfo,
  updateStudentInfo,
};
