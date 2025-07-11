const knex = require("../database/knex");
const moment = require("moment");

const admin = {
  // Account Management
  /**
   * Tạo tài khoản học viên mới.
   * @param {Object} param0 - Thông tin tài khoản.
   * @param {string} param0.username - Tên đăng nhập.
   * @param {string} param0.password - Mật khẩu.
   * @returns {Promise<Object|null>} Tài khoản vừa tạo hoặc null nếu thất bại.
   */
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

  /**
   * Tạo tài khoản giảng viên mới.
   * @param {Object} param0 - Thông tin tài khoản.
   * @param {string} param0.username - Tên đăng nhập.
   * @param {string} param0.password - Mật khẩu.
   * @returns {Promise<Object|null>} Tài khoản vừa tạo hoặc null nếu thất bại.
   */
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

  /**
   * Thêm nhiều tài khoản hệ thống.
   * @param {Array<Object>} datas - Danh sách tài khoản.
   * @returns {Promise<Array<Object>|null>} Danh sách tài khoản đã thêm.
   */

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

  /**
   * Kiểm tra tài khoản theo username.
   * @param {string} username - Tên đăng nhập.
   * @returns {Promise<Object|null>} Thông tin tài khoản nếu tồn tại.
   */
  checkUserAccount: async (username) => {
    const user = await knex("system_user")
      .where({ user_username: username })
      .first();

    if (user) {
      return user;
    }

    return null;
  },

  /**
   * Lấy danh sách tài khoản không phải admin.
   * @returns {Promise<Array<Object>|null>} Danh sách tài khoản người dùng.
   */
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

  /**
   * Lấy danh sách tài khoản học viên.
   * @returns {Promise<Array<Object>|null>} Danh sách tài khoản học viên.
   */
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

  /**
   * Lấy danh sách tài khoản giảng viên.
   * @returns {Promise<Array<Object>|null>} Danh sách tài khoản giảng viên.
   */
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

  /**
   * Cập nhật mật khẩu hoặc trạng thái tài khoản.
   * @param {Object} param0 - Dữ liệu cập nhật.
   * @param {string} param0.currentCode - Username cần cập nhật.
   * @param {string} [param0.newPassword] - Mật khẩu mới.
   * @param {number} [param0.newStatus] - Trạng thái tài khoản mới.
   * @returns {Promise<number>} Số bản ghi được cập nhật.
   */
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

  // Student Management
  /**
   * Lấy danh sách học viên.
   * @returns {Promise<Array<Object>|null>} Danh sách học viên.
   */
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

  /**
   * Lấy mã học viên cuối cùng.
   * @returns {Promise<Object|null>} Mã học viên mới nhất.
   */
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

  /**
   * Thêm một học viên mới.
   * @param {Object} student - Dữ liệu học viên.
   * @returns {Promise<Object|null>} Thông tin học viên đã thêm.
   */
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

  /**
   * Cập nhật thông tin học viên.
   * @param {Object} student - Dữ liệu học viên cần cập nhật.
   * @returns {Promise<Object|null>} Thông tin cập nhật.
   */
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

  /**
   * Nhập danh sách học viên từ tệp.
   * @param {Array<Object>} students - Danh sách học viên.
   * @returns {Promise<Object>} Kết quả chèn và danh sách bỏ qua.
   */
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

  /**
   * Lấy danh sách học viên chưa có tài khoản hệ thống.
   * @returns {Promise<Array<Object>|null>} Danh sách học viên.
   */
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

  /**
   * Lấy danh sách học viên đã đăng ký vào lớp.
   * @param {number} class_subject_id - ID lớp môn học.
   * @returns {Promise<Array<Object>|null>} Danh sách học viên.
   */
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

  /**
   * Lấy danh sách học viên chưa đăng ký lớp.
   * @param {number} class_subject_id - ID lớp môn học.
   * @returns {Promise<Array<Object>|null>} Danh sách học viên.
   */
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

  // Teacher Management
  /**
   * Lấy danh sách giảng viên.
   * @returns {Promise<Array<Object>|null>} Danh sách giảng viên.
   */
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

  /**
   * Lấy mã giảng viên cuối cùng.
   * @returns {Promise<Object|null>} Mã giảng viên cuối.
   */
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

  /**
   * Thêm giảng viên mới.
   * @param {Object} teacher - Dữ liệu giảng viên.
   * @returns {Promise<Object|null>} Thông tin giảng viên.
   */
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

  /**
   * Cập nhật thông tin giảng viên.
   * @param {Object} teacher - Dữ liệu giảng viên cần cập nhật.
   * @returns {Promise<Object|null>} Thông tin cập nhật.
   */
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
          teacher_status: teacher.teacher_status,
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
          teacher_status: teacher.teacher_status,
        });
    }

    if (updateCount === 0) return null;

    return { message: "Cập nhật thành công", updated: updateCount };
  },

  /**
   * Lấy danh sách giảng viên chưa có tài khoản hệ thống.
   * @returns {Promise<Array<Object>|null>} Danh sách giảng viên.
   */
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

  // Class & Enrollment
  /**
   * Tạo lớp học với giảng viên.
   * @param {Object} data - Dữ liệu lớp học.
   * @returns {Promise<Object>} Lớp học vừa tạo.
   */
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

  /**
   * Cập nhật lớp học.
   * @param {Object} payload - Dữ liệu lớp học cần cập nhật.
   * @returns {Promise<Object>} Kết quả cập nhật.
   */
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

  /**
   * Thêm học viên vào lớp học.
   * @param {Object} data - Danh sách học viên.
   * @returns {Promise<Array<string>>} Mã học viên đã thêm.
   */
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

  /**
   * Lấy danh sách lớp và học kỳ.
   * @returns {Promise<Array<Object>>} Danh sách lớp và học kỳ.
   */
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

  // Module Management
  /**
   * Lấy danh sách tất cả module.
   * @returns {Promise<Array<Object>|null>} Danh sách module.
   */
  getModuleCode: async () => {
    const module = await knex("module").select("*");

    if (!module) {
      return null;
    }

    return module;
  },

  /**
   * Lấy danh sách môn học đã phân lớp.
   * @returns {Promise<Array<Object>|null>} Danh sách lớp môn học.
   */
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

  /**
   * Lấy danh sách module có phân lớp.
   * @returns {Promise<Array<Object>>} Danh sách module.
   */
  getModuleFilter: async () => {
    const modules = await knex("module")
      .distinct()
      .whereIn("module_id", function () {
        this.select("module_id").from("class_subject");
      });

    return modules || [];
  },

  // Certificate Management
  /**
   * Lấy danh sách chứng chỉ theo lớp học phần.
   * @param {number} class_subject_id - ID lớp học phần.
   * @returns {Promise<Array<Object>|null>} Danh sách chứng chỉ.
   */
  getCertificates: async (class_subject_id) => {
    if (!class_subject_id) {
      return;
    }
    const certificates = await knex("certificate as cert")
      .where({
        "cert.class_subject_id": class_subject_id,
      })
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
        "cert.cert_number_id",
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

  /**
   * Lấy danh sách học viên đủ điều kiện cấp chứng chỉ.
   * @returns {Promise<Array<Object>>} Danh sách học viên đủ điều kiện.
   */
  getStudentEligible: async () => {
    const lists = knex("score as sc")
      .select(
        "s.student_code",
        "s.student_middle_name",
        "s.student_name",
        "cs.class_subject_id",
        "m.module_code",
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

  /**
   * Thêm chứng chỉ cho học viên theo lớp học phần.
   * @param {Object} data - Dữ liệu chứng chỉ.
   * @returns {Promise<Array<Object>>} Danh sách chứng chỉ đã thêm.
   */
  addCertificates: async ({ class_subject_id, student_codes }) => {
    const inserted = [];

    for (let student_code of student_codes) {
      // Kiểm tra trùng chứng chỉ
      const exists = await knex("certificate")
        .where({ student_code, class_subject_id })
        .first();

      if (exists) continue;

      // Lấy module_code và module_name, semester_end_date
      const classInfo = await knex("class_subject as cs")
        .join("module as m", "m.module_id", "cs.module_id")
        .join("semester as sem", "sem.semester_id", "cs.semester_id")
        .where("cs.class_subject_id", class_subject_id)
        .select("m.module_code", "m.module_name", "sem.semester_end_date")
        .first();

      if (!classInfo) continue;

      const { module_code, module_name, semester_end_date } = classInfo;
      const issued_date = semester_end_date || new Date();
      const year = issued_date.getFullYear();

      // Tạo tên viết tắt của môn học (chỉ lấy chữ cái đầu mỗi từ)
      const initials = module_name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("");

      // Tạo mã chứng chỉ theo yêu cầu mới
      const cert_number = `${student_code}/${initials}`;
      const cert_number_id = `${student_code}/${module_code}.${year}`;

      // Thêm vào bảng certificate
      const [cert_id] = await knex("certificate").insert({
        student_code,
        class_subject_id,
        cert_number,
        cert_number_id,
        issued_date,
      });

      inserted.push({ student_code, cert_number, cert_number_id });
    }

    return inserted;
  },

  /**
   * Lấy danh sách lớp đã cấp chứng chỉ.
   * @returns {Promise<Array<Object>|null>} Danh sách lớp và thông tin chứng chỉ.
   */
  getClassCert: async () => {
    const classes = await knex("certificate as cert")
      .join(
        "class_subject as cs",
        "cs.class_subject_id",
        "cert.class_subject_id"
      )
      .join("class as c", "c.class_id", "cs.class_id")
      .join("module as m", "m.module_id", "cs.module_id")
      .join(
        "teacher_subject_class as tsc",
        "tsc.class_subject_id",
        "cert.class_subject_id"
      )
      .join("teacher as t", "t.teacher_code", "tsc.teacher_code")
      .distinct(
        "m.module_code",
        "cert.class_subject_id",
        "c.class_name",
        "m.module_name",
        "t.teacher_name"
      );

    if (classes.length == 0) return null;

    return classes;
  },

  // DashBoard Admin
  /**
   * Lấy thống kê tổng quan cho dashboard.
   * @returns {Promise<Object>} Số lượng lớp, học viên, giảng viên và tài khoản.
   */
  getDashboardStats: async () => {
    try {
      const [classResult] = await knex("class_subject").count(
        "* as total_classes"
      );
      const [studentResult] = await knex("student").count(
        "* as total_students"
      );
      const [teacherResult] = await knex("teacher").count(
        "* as total_teachers"
      );
      const [accountResult] = await knex("system_user").count(
        "* as total_accounts"
      );

      return {
        total_classes: Number(classResult.total_classes),
        total_students: Number(studentResult.total_students),
        total_teachers: Number(teacherResult.total_teachers),
        total_accounts: Number(accountResult.total_accounts),
      };
    } catch (error) {
      console.error("Lỗi khi thống kê dashboard:", error);
      throw error;
    }
  },

  /**
   * Lấy thống kê số lượng học viên theo lớp.
   * @returns {Promise<Array<Object>|null>} Danh sách lớp và số học viên.
   */
  getCountStudentInClass: async () => {
    try {
      const result = await knex("class as c")
        .select("c.class_name")
        .count("cs.student_code as student_count")
        .join("class_subject as csj", "csj.class_id", "c.class_id")
        .join(
          "class_student as cs",
          "cs.class_subject_id",
          "csj.class_subject_id"
        )
        .groupBy("c.class_name");

      if (!result) return null;

      return result;
    } catch (error) {
      console.error("Lỗi thống kê số lượng học viên theo lớp:", error);
      throw error;
    }
  },

  /**
   * Lấy thống kê số chứng chỉ theo module.
   * @returns {Promise<Array<Object>|null>} Danh sách module và số học viên có chứng chỉ.
   */
  getModuleCertificateStats: async () => {
    const countCert = await knex("module as m")
      .select(
        "m.module_name",
        knex.raw("COUNT(DISTINCT cs.student_code) AS total_students"),
        knex.raw("COUNT(DISTINCT c.student_code) AS certified_students")
      )
      .join("class_subject as csj", "m.module_id", "csj.module_id")
      .join(
        "class_student as cs",
        "csj.class_subject_id",
        "cs.class_subject_id"
      )
      .leftJoin("certificate as c", function () {
        this.on("cs.student_code", "=", "c.student_code").andOn(
          "csj.class_subject_id",
          "=",
          "c.class_subject_id"
        );
      })
      .groupBy("m.module_name");

    if (countCert.length == 0) return null;

    return countCert;
  },
};

module.exports = admin;
