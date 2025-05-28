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

    res.json({
      message: "Score retrieved successfully",
      status: "success",
      data: score,
    });
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

    res.json({
      message: "Score retrieved successfully",
      status: "success",
      data: score,
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid student code or data not found"));
  }
}

module.exports = {
  getScore,
  getScoreBySemester,
};
