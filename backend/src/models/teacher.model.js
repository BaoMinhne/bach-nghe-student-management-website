const knex = require("../database/knex");

const teacher = {
  getTeacherInfo: async (teacherCode) => {
    const result = await knex("teacher").where("teacher_code", teacherCode);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  },

  updateTeacherInfo: async (teacherCode, updateData) => {
    const result = await knex("teacher")
      .where("teacher_code", teacherCode)
      .update({
        teacher_date_of_birth: updateData.teacher_date_of_birth,
        teacher_gender: updateData.teacher_gender,
        teacher_address: updateData.teacher_address,
        teacher_email: updateData.teacher_email,
        teacher_phone: updateData.teacher_phone,
      });

    if (result === 0) {
      return null;
    }
    return result;
  },

  getModuleTeaching: async (teacherCode) => {
    const result = await knex("teacher_subject_class as tsc")
      .join("teacher as t", "tsc.teacher_code", "t.teacher_code")
      .join(
        "class_subject as csub",
        "tsc.class_subject_id",
        "csub.class_subject_id"
      )
      .join("class as c", "csub.class_id", "c.class_id")
      .join("module as m", "csub.module_id", "m.module_id")
      .join("semester as se", "csub.semester_id", "se.semester_id")
      .where("t.teacher_code", teacherCode)
      .distinct(
        "t.teacher_code",
        "t.teacher_name",
        "c.class_code",
        "c.class_name",
        "m.module_code",
        "m.module_name",
        "se.semester_number",
        "se.semester_start_date",
        "se.semester_end_date"
      )
      .orderBy("se.semester_number", "desc");

    if (result.length === 0) {
      return null;
    }

    return result;
  },

  getStudentInClass: async ({ teacherCode, moduleCode, classCode }) => {
    const result = await knex("teacher as t")
      .join(
        "teacher_subject_class as tsc",
        "t.teacher_code",
        "tsc.teacher_code"
      )
      .join(
        "class_subject as csub",
        "tsc.class_subject_id",
        "csub.class_subject_id"
      )
      .join("class as c", "csub.class_id", "c.class_id")
      .join("module as m", "csub.module_id", "m.module_id")
      .join("semester as se", "csub.semester_id", "se.semester_id")
      .join(
        "class_student as cs",
        "csub.class_subject_id",
        "cs.class_subject_id"
      )
      .join("student as s", "cs.student_code", "s.student_code")
      .leftJoin("score as sc", function () {
        this.on("cs.class_subject_id", "=", "sc.class_subject_id").andOn(
          "s.student_code",
          "=",
          "sc.student_code"
        );
      })
      .where("t.teacher_code", teacherCode)
      .andWhere("m.module_code", moduleCode)
      .andWhere("c.class_code", classCode)
      .distinct(
        "t.teacher_name",
        "c.class_name",
        "m.module_name",
        "s.student_code",
        "s.student_middle_name",
        "s.student_name",
        "sc.score"
      )
      .orderBy([{ column: "s.student_code" }]);

    return result;
  },
};

module.exports = teacher;
