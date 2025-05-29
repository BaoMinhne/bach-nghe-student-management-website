const knex = require("../database/knex");

const student = {
  getAllSubjectScore: async (studentCode) => {
    const result = await knex("student as s")
      .join("class_student as cs", "s.student_code", "cs.student_code")
      .join("class as c", "cs.class_id", "c.class_id")
      .leftJoin("score as sc", function () {
        this.on("s.student_code", "=", "sc.student_code").andOn(
          "c.class_id",
          "=",
          "sc.class_id"
        );
      })
      .join("semester as se", "sc.semester_id", "se.semester_id")
      .leftJoin("module as m", "sc.module_id", "m.module_id")
      .where("s.student_code", studentCode)
      .select(
        "s.student_code as MÃ HS",
        "s.student_middle_name as HỌ ĐỆM",
        "s.student_name as TÊN",
        "m.module_code as Mã Môn học",
        "m.module_name as Tên Môn học",
        "se.semester_number as Học kỳ",
        "se.semester_start_date as Ngày bắt đầu",
        "se.semester_end_date as Ngày kết thúc",
        "sc.score as Tổng điểm"
      )
      .orderBy("m.module_code");

    return result;
  },

  filterSubjectScoreBySemester: async (studentCode, semester) => {
    const result = await knex("student as s")
      .join("class_student as cs", "s.student_code", "cs.student_code")
      .join("class as c", "cs.class_id", "c.class_id")
      .leftJoin("score as sc", function () {
        this.on("s.student_code", "=", "sc.student_code").andOn(
          "c.class_id",
          "=",
          "sc.class_id"
        );
      })
      .join("semester as se", "sc.semester_id", "se.semester_id")
      .leftJoin("module as m", "sc.module_id", "m.module_id")
      .where("s.student_code", studentCode)
      .andWhere("se.semester_number", semester)
      .select(
        "s.student_code as MÃ HS",
        "s.student_middle_name as HỌ ĐỆM",
        "s.student_name as TÊN",
        "m.module_code as Mã Môn học",
        "m.module_name as Tên Môn học",
        "se.semester_number as Học kỳ",
        "se.semester_start_date as Ngày bắt đầu",
        "se.semester_end_date as Ngày kết thúc",
        "sc.score as Tổng điểm"
      )
      .orderBy("m.module_code");

    return result;
  },

  getStudentInfo: async (studentCode) => {
    const result = await knex("student").where("student_code", studentCode);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  },

  updateStudentInfo: async (studentCode, updateData) => {
    const result = await knex("student")
      .where("student_code", studentCode)
      .update({
        student_address: updateData.student_address,
        student_email: updateData.student_email,
        student_phone: updateData.student_phone,
        student_IDCard: updateData.student_IDCard,
        student_country: updateData.student_country,
      });

    if (result === 0) {
      return null;
    }
    return result;
  },
};

module.exports = student;
