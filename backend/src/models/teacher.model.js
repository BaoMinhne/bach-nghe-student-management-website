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
};

module.exports = teacher;
