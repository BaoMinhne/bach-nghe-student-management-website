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

  createClassWithTeacher: async ({
    classID,
    moduleID,
    semesterID,
    teacherCode,
  }) => {
    const trx = await knex.transaction();
    try {
      const [clsId] = await trx("class_subject").insert({
        class_id: classID,
        module_id: moduleID,
        semester_id: semesterID,
      });

      if (!clsId) {
        throw new Error("Failed to insert class_subject");
      }

      await trx("teacher_subject_class").insert({
        teacher_code: teacherCode,
        class_subject_id: clsId,
      });

      await trx.commit();
      const newClass = await knex("class_subject")
        .where("class_subject.class_subject_id", clsId)
        .join("class", "class_subject.class_id", "class.class_id")
        .join("module", "class_subject.module_id", "module.module_id")
        .join("semester", "class_subject.semester_id", "semester.semester_id")
        .join(
          "teacher_subject_class",
          "class_subject.class_subject_id",
          "teacher_subject_class.class_subject_id"
        )
        .join(
          "teacher",
          "teacher_subject_class.teacher_code",
          "teacher.teacher_code"
        )
        .select(
          "class_subject.class_subject_id",
          "module.module_name",
          "class.class_name",
          "semester.semester_number",
          "teacher.teacher_name"
        )
        .first();

      return newClass;
    } catch (error) {
      await trx.rollback();
      console.error("Error creating class_subject:", error.message);
      throw error;
    }
  },

  addStudentsToClass: async ({ class_subject_id, student_codes }) => {
    const trx = await knex.transaction();
    try {
      // Check if class_subject_id exists
      const classSubject = await trx("class_subject")
        .where({ class_subject_id })
        .first();

      if (!classSubject) {
        throw new Error("Class subject not found");
      }

      const students = [];
      // Insert each student code into the class_subject_student table
      for (const studentCode of student_codes) {
        try {
          await trx("class_student").insert({
            class_subject_id,
            student_code: studentCode,
          });
          students.push(studentCode);
        } catch (err) {
          // Bỏ qua duplicate entry (đã tồn tại)
          console.error("Error adding students to class_subject:", err.message);
          throw err;
        }
      }

      await trx.commit();
      return students;
    } catch (error) {
      await trx.rollback();
      console.error("Error adding students to class subject:", error.message);
      throw error;
    }
  },
};

module.exports = admin;
