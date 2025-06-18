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

async function updateStudentScore(req, res, next) {
  const { classSubjectId, studentCode, score } = req.body;

  if (
    !classSubjectId ||
    !studentCode ||
    score === undefined ||
    score === null
  ) {
    return next(new ApiError(400, "All parameters are required"));
  }

  try {
    const scores = await teacherService.updateStudentScore(
      classSubjectId,
      studentCode,
      score
    );

    if (!scores) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(scores));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid parameters or data not found"));
  }
}

async function getStudentPassing(req, res, next) {
  const teacherCode = req.query.teacherCode;

  if (!teacherCode) {
    return next(new ApiError(400, "teacher code is required"));
  }

  try {
    const students = await teacherService.getStudentPassing(teacherCode);

    if (!students) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(students));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, `${error.message}`));
  }
}

async function getPassingPropotion(req, res, next) {
  const teacherCode = req.query.teacherCode;

  if (!teacherCode) {
    return next(new ApiError(400, "teacher code is required"));
  }

  try {
    const students = await teacherService.getPassingPropotion(teacherCode);

    if (!students) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(students));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, `${error.message}`));
  }
}

async function getAvgScore(req, res, next) {
  const teacherCode = req.query.teacherCode;

  if (!teacherCode) {
    return next(new ApiError(400, "teacher code is required"));
  }

  try {
    const students = await teacherService.getAvgScore(teacherCode);

    if (!students) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(students));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, `${error.message}`));
  }
}

async function getStudentCodeByName(req, res, next) {
  const { studentMiddleName, studentName } = req.query;

  if (!studentMiddleName || !studentName) {
    return next(
      new ApiError(
        400,
        "Both student middle name and student name are required"
      )
    );
  }

  try {
    const studentCode = await teacherService.getStudentCodeByName(
      studentMiddleName,
      studentName
    );

    if (!studentCode) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(studentCode));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid parameters or data not found"));
  }
}

async function importStudentScores(req, res, next) {
  const { classSubjectId, students } = req.body;

  if (!classSubjectId || !students || !Array.isArray(students)) {
    return next(new ApiError(400, "Invalid input data"));
  }

  try {
    const result = await teacherService.importStudentScores(
      classSubjectId,
      students
    );

    /*
	{
	Testing data structure:
		"classSubjectId" : "2",
		"students" : [
			{"student_code": "0092/24-THUD", "score": ""},
			{"student_code": "0093/24-THUD", "score": 3.006666666666667},
			{"student_code": "0094/24-THUD", "score": 3.8},
			{"student_code": "0095/24-THUD", "score": 7.466666666666667},
			{"student_code": "0096/24-THUD", "score": 5},
			{"student_code": "0097/24-THUD", "score": 6},
			{"student_code": "0098/24-THUD", "score": 7},
			{"student_code": "0099/24-THUD", "score": 8},
			{"student_code": "0100/24-THUD", "score": 9},
			{"student_code": "0101/24-THUD", "score": 10}
		]
	}
	*/

    if (!result) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(result));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid parameters or data not found"));
  }
}

async function getScoreProgress(req, res, next) {
  const teacherCode = req.query.teacherCode;
  if (!teacherCode) {
    return next(new ApiError(400, "teacher code is required"));
  }

  try {
    const progress = await teacherService.getScoreProgress(teacherCode);

    if (!progress) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(progress));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, `${error.message}`));
  }
}

async function getCountTeaching(req, res, next) {
  const teacherCode = req.query.teacherCode;

  if (!teacherCode) {
    return next(new ApiError(400, "teacher code is required"));
  }

  try {
    const count = await teacherService.getCountTeaching(teacherCode);

    if (count === null) {
      return next(new ApiError(401, "Data not found"));
    }

    return res.json(JSend.success(count));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, `${error.message}`));
  }
}

async function getLastUpdate(req, res, next) {
  const teacherCode = req.query.teacherCode;
  if (!teacherCode) {
    return next(new ApiError(400, "teacher code is required"));
  }
  try {
    const lastUpdate = await teacherService.getLastUpdate(teacherCode);

    if (!lastUpdate) {
      return next(new ApiError(401, "Data not found"));
    }

    const updatedAt = Object.values(lastUpdate)[0]; // lấy giá trị từ 'max(`updated_at`)' key
    const formatted = moment(updatedAt).format("HH:mm DD/MM/YYYY ");

    return res.json(JSend.success(formatted));
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, `${error.message}`));
  }
}

module.exports = {
  getTeacherInfo,
  updateTeacherInfo,
  getModuleTeaching,
  getStudentInClass,
  updateStudentScore,
  getStudentPassing,
  getPassingPropotion,
  getAvgScore,
  getStudentCodeByName,
  importStudentScores,
  getScoreProgress,
  getCountTeaching,
  getLastUpdate,
};
