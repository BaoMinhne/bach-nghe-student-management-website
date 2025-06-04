const knex = require("../database/knex");
const admin = {
  createStudentAccount: async ({ username, password }) => {
    const student = await knex("system_user").insert({
      user_username: username,
      user_pass: password,
    });

    if (student.length > 0) {
      // Knex insert returns an array of IDs for MySQL; fetch the inserted record
      const insertedStudent = await knex("system_user")
        .where({ user_username: username })
        .first();
      return insertedStudent;
    }

    return null;
  },

  createTeacherAccount: async ({ username, password }) => {
    const teacher = await knex("system_user").insert({
      user_username: username,
      user_pass: password,
      user_role: 2, // Assuming a role field exists
    });

    if (teacher.length > 0) {
      // Knex insert returns an array of IDs for MySQL; fetch the inserted record
      const insertedTeacher = await knex("system_user")
        .where({ user_username: username })
        .first();
      return insertedTeacher;
    }

    return null;
  },

  checkUserAccount: async (username) => {
    const user = await knex("system_user")
      .where({ user_username: username })
      .first();

    if (user) {
      return user;
    }

    return null;
  },

  getStudentAccount: async () => {
    const users = await knex("system_user").select("*").where({
      user_role: 1, // Assuming 1 is the role for students
    });

    if (users.length === 0) {
      return null;
    }

    return users;
  },

  getStudentAccount: async () => {
    const users = await knex("system_user").select("*").where({
      user_role: 1, // Assuming 1 is the role for students
    });

    if (users.length === 0) {
      return null;
    }

    return users;
  },

  getTeacherAccount: async () => {
    const users = await knex("system_user").select("*").where({
      user_role: 2, // Assuming 2 is the role for teachers
    });

    if (users.length === 0) {
      return null;
    }

    return users;
  },
};

module.exports = admin;
