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
};

module.exports = student;
