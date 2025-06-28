const knex = require("../database/knex");
const moment = require("moment");

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

  updateClass: async (payload) => {
    if (!payload.classSubjectID) {
      throw new Error("Thiếu class_subject_id");
    }

    const trx = await knex.transaction();
    try {
      const updateStatus = await trx("class_subject")
        .where({ class_subject_id: payload.classSubjectID })
        .update({
          semester_id: payload.semesterID,
          class_status: payload.classStatus,
        });

      const exist = await trx("teacher_subject_class")
        .select("*")
        .where({ class_subject_id: payload.classSubjectID });

      if (exist.length === 0) {
        await trx("teacher_subject_class").insert({
          teacher_code: payload.teacherCode,
          class_subject_id: payload.classSubjectID,
        });
      } else {
        await trx("teacher_subject_class")
          .update({ teacher_code: payload.teacherCode })
          .where({ class_subject_id: payload.classSubjectID });
      }

      await trx.commit();

      return {
        class_subject_updated: updateStatus,
        teacher_updated: payload.teacherCode,
      };
    } catch (error) {
      await trx.rollback();
      console.error("Error updating class_subject:", error.message);
      throw error;
    }
  },

  getClassCodeAndSemester: async () => {
    const classes = await knex("class").select("*");
    const result = [];

    if (classes && classes.length > 0) {
      for (const classItem of classes) {
        const semester = await knex("semester")
          .select("*")
          .where({ class_id: classItem.class_id });

        result.push({ class: classItem, semesters: semester });
      }
    }

    return result;
  },

  getModuleCode: async () => {
    const module = await knex("module").select("*");

    if (!module) {
      return null;
    }

    return module;
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

  getModuleList: async () => {
    const result = await knex("class_subject as cs")
      .join("class as c", "cs.class_id", "c.class_id")
      .join("module as m", "cs.module_id", "m.module_id")
      .join("semester as s", "cs.semester_id", "s.semester_id")
      .leftJoin(
        "teacher_subject_class as tsc",
        "cs.class_subject_id",
        "tsc.class_subject_id"
      )
      .leftJoin("teacher as t", "tsc.teacher_code", "t.teacher_code")
      .select(
        "cs.class_subject_id",
        "c.class_id",
        "c.class_code",
        "c.class_name",
        "m.module_code",
        "m.module_name",
        "s.semester_number",
        "cs.class_status",
        "s.semester_id",
        "s.semester_start_date",
        "s.semester_end_date",
        "tsc.teacher_code",
        "t.teacher_name"
      )
      .orderBy("s.semester_number", "asc");

    if (!result) return null;

    return result;
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

  getStudentList: async () => {
    const students = await knex("student").select("*");

    if (students.length === 0) {
      return null;
    }

    const result = [];
    let formatted = 0;
    for (const student of students) {
      if (student.student_date_of_birth) {
        const dateOfBirth = student.student_date_of_birth; // lấy giá trị từ 'max(`updated_at`)' key
        formatted = moment(dateOfBirth).format("DD/MM/YYYY ");
      }

      result.push({
        student_code: student.student_code,
        student_middle_name: student.student_middle_name,
        student_name: student.student_name,
        student_date_of_birth: formatted,
        student_gender: student.student_gender,
        student_address: student.student_address,
        student_email: student.student_email,
        student_phone: student.student_phone,
        student_status: student.student_status,
        student_IDCard: student.student_IDCard,
        student_country: student.student_country,
      });
    }

    return result;
  },

  importStudentList: async (students) => {
    const inserted = [];
    const skipped = [];
    for (const student of students) {
      try {
        const exists = await knex("student")
          .where({
            student_middle_name: student.student_middle_name,
            student_name: student.student_name,
          })
          .select("*")
          .first();

        if (exists) {
          skipped.push(
            student.student_middle_name + " " + student.student_name
          );
          continue;
        }

        if (student.student_middle_name === "" || student.student_name === "") {
          skipped.push(
            student.student_middle_name + " " + student.student_name
          );
          continue;
        }

        let formatted = 0;
        if (student.student_date_of_birth) {
          formatted = moment(
            student.student_date_of_birth,
            "DD/MM/YYYY"
          ).format("YYYY-MM-DD");
        }

        if (
          student.student_gender === null ||
          student.student_gender === "" ||
          student.student_gender === undefined
        ) {
          student.student_gender = "other";
        }

        await knex("student").insert({
          student_code: student.student_code,
          student_middle_name: student.student_middle_name,
          student_name: student.student_name,
          student_date_of_birth: formatted,
          student_gender: student.student_gender,
        });
        inserted.push(student.student_middle_name + " " + student.student_name);
      } catch (error) {
        console.error(
          `Error processing student ${student.student_code}:`,
          error
        );
        continue;
      }
    }
    // console.log("skip: \n" + skipped);
    // console.log("insert: \n" + inserted);
    return {
      insertedCount: inserted.length,
      inserted,
      skipped,
    };
  },

  getLastStudentCode: async () => {
    const stCode = await knex("student")
      .select("student_code")
      .orderBy("student_code", "desc")
      .limit(1);

    if (!stCode) {
      return null;
    }

    return stCode[0];
  },

  addNewStudent: async (student) => {
    let formatted = 0;
    const inserted = [];
    if (student.student_date_of_birth) {
      formatted = moment(student.student_date_of_birth, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }
    const newStudent = await knex("student").insert({
      student_code: student.student_code,
      student_middle_name: student.student_middle_name,
      student_name: student.student_name,
      student_phone: student.student_phone,
    });

    if (newStudent) {
      inserted.push({
        student_code: student.student_code,
        student_middle_name: student.student_middle_name,
        student_name: student.student_name,
        student_phone: student.student_phone,
      });
      return inserted[0];
    }

    return null;
  },

  updateStudentInfor: async (student) => {
    const updateCount = await knex("student")
      .where({ student_code: student.student_code })
      .update({
        // student_code: student.student_code,
        student_middle_name: student.student_middle_name,
        student_name: student.student_name,
        student_status: student.student_status,
      });

    if (updateCount === 0) return null;

    return { message: "Cập nhật thành công", updated: updateCount };
  },

  getTeacherList: async () => {
    const teachers = await knex("teacher").select("*");

    if (teachers.length === 0) {
      return null;
    }

    const result = [];
    let formatted = 0;
    for (const teacher of teachers) {
      if (teacher.teacher_date_of_birth) {
        const dateOfBirth = teacher.teacher_date_of_birth; // lấy giá trị từ 'max(`updated_at`)' key
        formatted = moment(dateOfBirth).format("DD/MM/YYYY ");
      }

      result.push({
        teacher_code: teacher.teacher_code,
        teacher_name: teacher.teacher_name,
        teacher_date_of_birth: formatted,
        teacher_gender: teacher.teacher_gender,
        teacher_address: teacher.teacher_address,
        teacher_email: teacher.teacher_email,
        teacher_phone: teacher.teacher_phone,
        teacher_status: teacher.teacher_status,
      });
    }

    return result;
  },

  getLastTeacherCode: async () => {
    const teacherCode = await knex("teacher")
      .select("teacher_code")
      .orderBy("teacher_code", "desc")
      .limit(1);

    if (!teacherCode) {
      return null;
    }

    return teacherCode[0];
  },

  addNewTeacher: async (teacher) => {
    const inserted = [];
    console.log(teacher.teacher_date_of_birth);
    const newTeacher = await knex("teacher").insert({
      teacher_code: teacher.teacher_code,
      teacher_name: teacher.teacher_name,
      teacher_date_of_birth: teacher.teacher_date_of_birth,
      teacher_gender: teacher.teacher_gender,
      teacher_address: teacher.teacher_address,
      teacher_email: teacher.teacher_email,
      teacher_phone: teacher.teacher_phone,
    });

    if (newTeacher) {
      inserted.push({
        teacher_code: teacher.teacher_code,
        teacher_name: teacher.teacher_name,
        teacher_date_of_birth: teacher.teacher_date_of_birth,
        teacher_gender: teacher.teacher_gender,
        teacher_address: teacher.teacher_address,
        teacher_email: teacher.teacher_email,
        teacher_phone: teacher.teacher_phone,
      });
      return inserted[0];
    }

    return null;
  },

  updateTeacherInfor: async (teacher) => {
    let updateCount = 0;
    if (teacher.teacher_date_of_birth) {
      updateCount = await knex("teacher")
        .where({ teacher_code: teacher.teacher_code })
        .update({
          teacher_name: teacher.teacher_name,
          teacher_date_of_birth: teacher.teacher_date_of_birth,
          teacher_gender: teacher.teacher_gender,
          teacher_address: teacher.teacher_address,
          teacher_email: teacher.teacher_email,
          teacher_phone: teacher.teacher_phone,
        });
    } else {
      updateCount = await knex("teacher")
        .where({ teacher_code: teacher.teacher_code })
        .update({
          teacher_name: teacher.teacher_name,
          teacher_gender: teacher.teacher_gender,
          teacher_address: teacher.teacher_address,
          teacher_email: teacher.teacher_email,
          teacher_phone: teacher.teacher_phone,
        });
    }

    if (updateCount === 0) return null;

    return { message: "Cập nhật thành công", updated: updateCount };
  },

  getListStudentCode: async () => {
    const result = await knex("student")
      .select("student_code", "student_middle_name", "student_name")
      .whereNotIn("student_code", function () {
        this.select("user_username").from("system_user");
      });

    if (result.length == 0) {
      return null;
    }

    return result;
  },

  getStudentNotInClass: async (class_subject_id) => {
    const result = await knex("student")
      .select("student_code", "student_middle_name", "student_name")
      .whereNotIn("student_code", function () {
        this.select("student_code")
          .from("class_student")
          .where({ class_subject_id: class_subject_id });
      });

    if (result.length == 0) return null;

    return result;
  },

  getStudentInClass: async (class_subject_id) => {
    const result = await knex("student")
      .select("student_code", "student_middle_name", "student_name")
      .whereIn("student_code", function () {
        this.select("student_code")
          .from("class_student")
          .where({ class_subject_id: class_subject_id });
      });

    if (result.length == 0) return null;

    return result;
  },

  getListTeacherCode: async () => {
    const result = await knex("teacher")
      .select("teacher_code", "teacher_name")
      .whereNotIn("teacher_code", function () {
        this.select("user_username").from("system_user");
      });

    if (!result) {
      return null;
    }

    return result;
  },

  getModuleFilter: async () => {
    const modules = await knex("module")
      .distinct()
      .whereIn("module_id", function () {
        this.select("module_id").from("class_subject");
      });

    return modules || [];
  },

  addNewAccount: async (datas) => {
    const inserted = [];

    for (const data of datas) {
      try {
        const newAccount = await knex("system_user").insert({
          user_username: data.username,
          user_pass: data.pass,
          user_role: data.role,
        });

        if (newAccount) {
          inserted.push({
            user_username: data.username,
            user_pass: data.pass,
            user_role: data.role,
          });
        }
      } catch (err) {
        console.error("Lỗi khi thêm tài khoản:", data.username, err);
        // Bạn có thể bỏ qua hoặc xử lý thêm ở đây
      }
    }

    return inserted.length > 0 ? inserted : null;
  },

  getCertificates: async () => {
    const certificates = await knex("certificate as cert")
      .select(
        "cert.certificate_id",
        "cert.student_code",
        "s.student_middle_name",
        "s.student_name",
        "s.student_IDCard",
        "s.student_address",
        "s.student_date_of_birth",
        "s.student_gender",
        "m.module_name",
        "c.class_name",
        "cert.cert_number",
        "cert.issued_date",
        "cert.note"
      )
      .join("student as s", "s.student_code", "cert.student_code")
      .join(
        "class_subject as cs",
        "cs.class_subject_id",
        "cert.class_subject_id"
      )
      .join("class as c", "c.class_id", "cs.class_id")
      .join("module as m", "m.module_id", "cs.module_id")
      .orderBy("cert.certificate_id", "desc");

    if (certificates.length == 0) {
      return null;
    }

    return certificates;
  },

  getStudentEligible: async () => {
    const lists = knex("score as sc")
      .select(
        "s.student_code",
        "s.student_middle_name",
        "s.student_name",
        "cs.class_subject_id",
        "m.module_name",
        "sc.score",
        "c.class_name",
        "sem.semester_end_date as issued_date"
      )
      .join("student as s", "s.student_code", "sc.student_code")
      .join("class_subject as cs", "cs.class_subject_id", "sc.class_subject_id")
      .join("class as c", "cs.class_id", "c.class_id")
      .join("module as m", "cs.module_id", "m.module_id")
      .join("semester as sem", "sem.semester_id", "cs.semester_id")
      .where("sc.score", ">=", 5)
      .whereNotExists(function () {
        this.select(knex.raw(1))
          .from("certificate as c")
          .whereRaw("c.student_code = s.student_code")
          .andWhereRaw("c.class_subject_id = cs.class_subject_id");
      });

    if (lists.length == 0) return null;

    return lists;
  },

  addCertificates: async ({ class_subject_id, student_codes }) => {
    const inserted = [];

    for (let student_code of student_codes) {
      // Kiểm tra trùng chứng chỉ
      const exists = await knex("certificate")
        .where({ student_code, class_subject_id })
        .first();

      if (exists) continue;

      // Lấy module_code từ class_subject_id
      const classInfo = await knex("class_subject as cs")
        .join("module as m", "m.module_id", "cs.module_id")
        .join("semester as sem", "sem.semester_id", "cs.semester_id")
        .where("cs.class_subject_id", class_subject_id)
        .select("m.module_code", "sem.semester_end_date")
        .first();

      if (!classInfo) continue;

      const cert_number = `${classInfo.module_code}-${student_code}`;
      const issued_date = classInfo.semester_end_date || new Date();

      // Thêm vào bảng certificate
      const [cert_id] = await knex("certificate").insert({
        student_code,
        class_subject_id,
        cert_number,
        issued_date,
      });

      inserted.push({ student_code, cert_number });
    }

    return inserted;
  },
};

module.exports = admin;
