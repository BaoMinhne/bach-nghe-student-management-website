const teacherService = require("../models/teacher.model");
const JSend = require("../jsend");
const ApiError = require("../api-error");
const moment = require("moment");

async function getTeacherInfo(req, res, next) {
  const teacherCode = req.query.teacherCode;

  if (!teacherCode) {
    return next(new ApiError(400, "teacher code is required"));
  }

  try {
    const teacherInfo = await teacherService.getTeacherInfo(teacherCode);

    if (!teacherInfo) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(teacherInfo));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid teacher code or data not found"));
  }
}

async function updateTeacherInfo(req, res, next) {
  const teacherCode = req.query.teacherCode;
  if (!teacherCode) {
    return next(new ApiError(400, "Teacher code is required"));
  }

  const {
    teacher_date_of_birth,
    teacher_gender,
    teacher_address,
    teacher_email,
    teacher_phone,
  } = req.body;

  if (
    !teacher_date_of_birth ||
    !teacher_gender ||
    !teacher_address ||
    !teacher_email ||
    !teacher_phone
  ) {
    return next(new ApiError(400, "All fields are required"));
  }
  let dateOfBirth = null;
  if (teacher_date_of_birth) {
    dateOfBirth = moment(teacher_date_of_birth, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
  }

  const updateData = {
    teacher_date_of_birth: dateOfBirth,
    teacher_gender,
    teacher_address,
    teacher_email,
    teacher_phone,
  };

  try {
    const updatedTeacher = await teacherService.updateTeacherInfo(
      teacherCode,
      updateData
    );
    if (!updatedTeacher) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(updateData));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Infomation not valid or data not found"));
  }
}

async function getModuleTeaching(req, res, next) {
  const teacherCode = req.query.teacherCode;

  if (!teacherCode) {
    return next(new ApiError(400, "teacher code is required"));
  }

  try {
    const moduleTeaching = await teacherService.getModuleTeaching(teacherCode);

    if (!moduleTeaching) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(moduleTeaching));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid teacher code or data not found"));
  }
}

async function getStudentInClass(req, res, next) {
  const { teacherCode, moduleCode, classCode } = req.query;

  if (!teacherCode || !moduleCode || !classCode) {
    return next(new ApiError(400, "All parameters are required"));
  }

  try {
    const students = await teacherService.getStudentInClass({
      teacherCode,
      moduleCode,
      classCode,
    });

    if (!students) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(students));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid parameters or data not found"));
  }
}

module.exports = {
  getTeacherInfo,
  updateTeacherInfo,
  getModuleTeaching,
  getStudentInClass,
};
