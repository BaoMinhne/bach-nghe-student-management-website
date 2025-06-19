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

  getAccountList: async () => {
    const users = await knex("system_user")
      .select("*")
      .whereNot({ user_role: 0 }) // 0 = admin
      .orderBy("user_role", "asc")
      .orderBy("user_username", "asc");

    if (users.length === 0) return null;

    const result = [];

    for (const user of users) {
      let roleName = "";
      let extraInfo = null;

      if (user.user_role === 1) {
        roleName = "Học viên";
        extraInfo = await knex("student")
          .select(
            "student_middle_name",
            "student_name",
            "student_email",
            "student_phone"
          )
          .where({ student_code: user.user_username })
          .first();
      } else if (user.user_role === 2) {
        roleName = "Giảng viên";
        extraInfo = await knex("teacher")
          .select("teacher_name", "teacher_email", "teacher_phone")
          .where({ teacher_code: user.user_username })
          .first();
      }

      result.push({
        user_id: user.user_id,
        user_username: user.user_username,
        user_pass: user.user_pass,
        user_role: roleName,
        user_status: user.user_status,
        info: extraInfo || null,
      });
    }

    return result;
  },

  getStudentAccount: async () => {
    const users = await knex("system_user").select("*").where({
      user_role: 1, // Assuming 1 is the role for students
    });

    if (users.length === 0) {
      return null;
    }

    const result = [];

    for (const user of users) {
      let extraInfo = null;
      let roleName = "";
      roleName = "Học viên";
      extraInfo = await knex("student")
        .select(
          "student_middle_name",
          "student_name",
          "student_email",
          "student_phone"
        )
        .where({ student_code: user.user_username })
        .first();

      result.push({
        user_id: user.user_id,
        user_username: user.user_username,
        user_pass: user.user_pass,
        user_role: roleName,
        user_status: user.user_status,
        info: extraInfo || null,
      });
    }

    return result;
  },

  getTeacherAccount: async () => {
    const users = await knex("system_user").select("*").where({
      user_role: 2, // Assuming 2 is the role for teachers
    });

    if (users.length === 0) {
      return null;
    }

    const result = [];

    for (const user of users) {
      let extraInfo = null;
      let roleName = "";
      roleName = "Giảng viên";
      extraInfo = await knex("teacher")
        .select("teacher_name", "teacher_email", "teacher_phone")
        .where({ teacher_code: user.user_username })
        .first();

      result.push({
        user_id: user.user_id,
        user_username: user.user_username,
        user_pass: user.user_pass,
        user_role: roleName,
        user_status: user.user_status,
        info: extraInfo || null,
      });
    }

    return result;
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
      // Kiểm tra class_subject_id có tồn tại không
      const classSubject = await trx("class_subject")
        .where({ class_subject_id })
        .first();

      if (!classSubject) {
        throw new Error("Class subject not found");
      }

      const students = [];

      for (const studentCode of student_codes) {
        try {
          // Thêm vào class_student
          await trx("class_student").insert({
            class_subject_id,
            student_code: studentCode,
          });

          // Thêm vào score (với điểm NULL ban đầu)
          await trx("score").insert({
            class_subject_id,
            student_code: studentCode,
            score: null, // optional vì mặc định đã là null
          });

          students.push(studentCode);
        } catch (err) {
          // Nếu bị duplicate (đã tồn tại trong class_student hoặc score), ghi log và bỏ qua
          console.error("Lỗi khi thêm sinh viên:", err.message);

          // Nếu lỗi không phải duplicate thì rollback
          if (!err.message.includes("duplicate")) {
            throw err;
          }
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

  updateAccount: async ({ currentCode, newPassword, newStatus }) => {
    const updates = {};

    // chỉ thêm nếu có giá trị
    if (typeof newPassword === "string" && newPassword.trim() !== "") {
      updates.user_pass = newPassword.trim();
    }

    if (typeof newStatus === "number") {
      updates.user_status = newStatus;
    }

    // nếu không có gì để update, thì báo lỗi
    if (Object.keys(updates).length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    const updatedRows = await knex("system_user")
      .where({ user_username: currentCode })
      .update(updates);

    return updatedRows;
  },
};

module.exports = admin;
