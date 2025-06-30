const knex = require("../database/knex");

const teacher = {
  /**
   * Lấy thông tin giảng viên theo mã.
   * @function
   * @async
   * @param {string} teacherCode - Mã giảng viên.
   * @returns {Promise<Object|null>} Thông tin giảng viên hoặc null nếu không tìm thấy.
   * @route GET /api/teacher/info
   */
  getTeacherInfo: async (teacherCode) => {
    const result = await knex("teacher").where("teacher_code", teacherCode);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  },

  /**
   * Cập nhật thông tin giảng viên.
   * @function
   * @async
   * @param {string} teacherCode - Mã giảng viên.
   * @param {Object} updateData - Dữ liệu cập nhật.
   * @returns {Promise<number|null>} Số dòng cập nhật hoặc null nếu không có dòng nào.
   */
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

  /**
   * Lấy danh sách lớp môn học mà giảng viên đang dạy.
   * @function
   * @async
   * @param {string} teacherCode - Mã giảng viên.
   * @returns {Promise<Array|null>} Danh sách lớp môn học hoặc null nếu không có.
   * @route GET /api/teacher/modules
   */
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
        "csub.class_subject_id",
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

  /**
   * Lấy danh sách học viên trong lớp mà giảng viên giảng dạy.
   * @function
   * @async
   * @param {Object} params - Tham số bao gồm mã giảng viên, mã môn học và mã lớp.
   * @returns {Promise<Array>} Danh sách học viên trong lớp.
   * @route GET /api/teacher/students-in-class
   */
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

  /**
   * Cập nhật điểm cho học viên trong lớp học phần.
   * @function
   * @async
   * @param {number} classSubjectId - ID lớp học phần.
   * @param {string} studentCode - Mã học viên.
   * @param {number} score - Điểm cần cập nhật.
   * @returns {Promise<number|null>} Kết quả cập nhật.
   */
  updateStudentScore: async (classSubjectId, studentCode, score) => {
    const result = await knex("score")
      .where({
        class_subject_id: classSubjectId,
        student_code: studentCode,
      })
      .update({ score });

    if (result === 0) {
      return null;
    }
    return result;
  },

  /**
   * Lấy danh sách học viên qua môn theo lớp giảng dạy.
   * @function
   * @async
   * @param {string} teacherCode - Mã giảng viên.
   * @returns {Promise<Array|null>} Danh sách tổng số học viên và số lượng qua môn.
   * @route GET /api/teacher/students-passed
   */
  getStudentPassing: async (teacherCode) => {
    const result = await knex("teacher_subject_class as tsc")
      .join(
        "class_subject as csj",
        "tsc.class_subject_id",
        "csj.class_subject_id"
      )
      .join("class as c", "csj.class_id", "c.class_id")
      .join("module as m", "csj.module_id", "m.module_id")
      .join(
        "class_student as cs",
        "csj.class_subject_id",
        "cs.class_subject_id"
      )
      .leftJoin("score as sc", function () {
        this.on("sc.class_subject_id", "=", "csj.class_subject_id").andOn(
          "sc.student_code",
          "=",
          "cs.student_code"
        );
      })
      .where("tsc.teacher_code", teacherCode)
      .select(
        "c.class_code as class",
        "m.module_name as subject",
        knex.raw("COUNT(DISTINCT cs.student_code) as total_students"),
        knex.raw(
          "COUNT(DISTINCT CASE WHEN sc.score >= 4.0 THEN sc.student_code END) as passed_students"
        )
      )
      .groupBy(["c.class_code", "m.module_name"])
      .orderBy(["c.class_code", "m.module_name"]);

    if (result.length === 0) {
      return null;
    }

    return result;
  },

  /**
   * Tỷ lệ học viên qua môn của giảng viên.
   * @function
   * @async
   * @param {string} teacherCode - Mã giảng viên.
   * @returns {Promise<Object|null>} Tỷ lệ phần trăm học viên qua môn.
   * @route GET /api/teacher/passing-propotion
   */
  getPassingPropotion: async (teacherCode) => {
    const result = await knex("teacher_subject_class as tsc")
      .join(
        "class_subject as csj",
        "tsc.class_subject_id",
        "csj.class_subject_id"
      )
      .join(
        "class_student as cs",
        "cs.class_subject_id",
        "csj.class_subject_id"
      )
      .leftJoin("score as sc", function () {
        this.on("sc.class_subject_id", "=", "csj.class_subject_id").andOn(
          "sc.student_code",
          "=",
          "cs.student_code"
        );
      })
      .where("tsc.teacher_code", teacherCode)
      .select(
        knex.raw("COUNT(DISTINCT cs.student_code) AS total_students"),
        knex.raw(`
        COUNT(DISTINCT CASE WHEN sc.score >= 4.0 THEN sc.student_code END) AS passed_students
      `),
        knex.raw(`
        ROUND(
          COUNT(DISTINCT CASE WHEN sc.score >= 4.0 THEN sc.student_code END) * 100.0
          / NULLIF(COUNT(DISTINCT cs.student_code), 0), 2
        ) AS passing_percentage
      `)
      );

    if (!result || result.length === 0) {
      return null;
    }

    return result[0]; // vì chỉ có 1 hàng kết quả
  },

  /**
   * Tính điểm trung bình các môn học mà giảng viên phụ trách, theo từng lớp.
   * @route GET /api/teacher/avg-score
   * @param {string} teacherCode - Mã giảng viên.
   * @returns {Promise<Array<{ class: string, subject: string, average_score: number }>|null>}
   */
  getAvgScore: async (teacherCode) => {
    const result = await knex("teacher_subject_class as tsc")
      .join(
        "class_subject as csj",
        "tsc.class_subject_id",
        "csj.class_subject_id"
      )
      .join("class as c", "csj.class_id", "c.class_id")
      .join("module as m", "csj.module_id", "m.module_id")
      .join(
        "class_student as cs",
        "csj.class_subject_id",
        "cs.class_subject_id"
      )
      .join("score as sc", function () {
        this.on("sc.class_subject_id", "=", "csj.class_subject_id").andOn(
          "sc.student_code",
          "=",
          "cs.student_code"
        );
      })
      .where("tsc.teacher_code", teacherCode)
      .select(
        "c.class_code as class",
        "m.module_name as subject",
        knex.raw(" ROUND(AVG(sc.score), 2) as average_score")
      )
      .groupBy(["c.class_code", "m.module_name"])
      .orderBy("c.class_code", "asc");

    if (result.length === 0) {
      return null;
    }

    return result;
  },

  /**
   * Tìm mã học viên theo họ đệm và tên.
   * @route GET /api/teacher/student-code
   * @param {string} studentMiddleName - Họ đệm học viên.
   * @param {string} studentName - Tên học viên.
   * @returns {Promise<string|null>} - Mã học viên hoặc null nếu không tìm thấy.
   */
  getStudentCodeByName: async (studentMiddleName, studentName) => {
    const result = await knex("student")
      .where({
        student_middle_name: studentMiddleName,
        student_name: studentName,
      })
      .select("student_code");

    if (result.length === 0) {
      return null;
    }

    return result[0].student_code;
  },

  /**
   * Nhập điểm hàng loạt cho lớp học phần, bỏ qua học viên không hợp lệ hoặc không có thay đổi.
   * @route POST /api/teacher/import-scores
   * @param {string} classSubjectId - ID lớp học phần.
   * @param {Array<{ student_code: string, score: number|string }>} students - Danh sách học viên và điểm.
   * @returns {Promise<{ updatedCount: number, updated: string[], skipped: string[] }>}
   */
  importStudentScores: async (classSubjectId, students) => {
    const updated = [];
    const skipped = [];
    for (const student of students) {
      try {
        const exists = await knex("score")
          .where({
            class_subject_id: classSubjectId,
            student_code: student.student_code,
          })
          .select("score")
          .first();

        if (!exists) {
          skipped.push(student.student_code);
          continue;
        }

        if (student.score === "" || student.score === undefined) {
          skipped.push(student.student_code);
          continue;
        }

        if (Number(exists.score) === Number(student.score)) {
          skipped.push(student.student_code);
          continue;
        }

        await knex("score")
          .where({
            class_subject_id: classSubjectId,
            student_code: student.student_code,
          })
          .update({ score: student.score });

        updated.push(student.student_code);
      } catch (error) {
        console.error(
          `Error processing student ${student.student_code}:`,
          error
        );
        continue;
      }
    }
    return {
      updatedCount: updated.length,
      updated,
      skipped,
    };
  },

  /**
   * Lấy tiến độ nhập điểm của giảng viên, bao gồm tổng số sinh viên và số sinh viên đã có điểm.
   * @route GET /api/teacher/score-progress
   * @param {string} teacherCode - Mã giảng viên.
   * @returns {Promise<{ tong_sinh_vien: string, so_diem_da_nhap: string }|null>}
   */
  getScoreProgress: async (teacherCode) => {
    const result = await knex("teacher_subject_class as tsc")
      .join(
        "class_student as cs",
        "cs.class_subject_id",
        "tsc.class_subject_id"
      )
      .leftJoin("score as s", function () {
        this.on("s.class_subject_id", "=", "cs.class_subject_id")
          .andOn("s.student_code", "=", "cs.student_code")
          .andOnNotNull("s.score");
      })
      .where("tsc.teacher_code", teacherCode)
      .countDistinct("cs.student_code as tong_sinh_vien")
      .countDistinct({ so_diem_da_nhap: "s.student_code" })
      .groupBy("tsc.teacher_code");

    if (result.length === 0) {
      return null;
    }

    return result[0];
  },

  /**
   * Đếm tổng số lớp học phần mà giảng viên đang giảng dạy.
   * @route GET /api/teacher/count-teaching
   * @param {string} teacherCode - Mã giảng viên.
   * @returns {Promise<string|null>} - Số lượng lớp học phần.
   */
  getCountTeaching: async (teacherCode) => {
    const result = await knex("teacher_subject_class as tsc")
      .where("tsc.teacher_code", teacherCode)
      .countDistinct("tsc.class_subject_id as count_teaching");

    if (result.length === 0) {
      return null;
    }

    return result[0].count_teaching;
  },

  /**
   * Lấy thời điểm cập nhật điểm gần nhất của giảng viên.
   * @route GET /api/teacher/last-update
   * @param {string} teacherCode - Mã giảng viên.
   * @returns {Promise<{ last_update: string }|null>}
   */
  getLastUpdate: async (teacherCode) => {
    const result = await knex("score as s")
      .join(
        "teacher_subject_class as tsc",
        "tsc.class_subject_id",
        "s.class_subject_id"
      )
      .where("tsc.teacher_code", teacherCode)
      .whereNotNull("s.score")
      .max("updated_at as last_update")
      .first();

    if (!result) {
      return null;
    }

    return result;
  },
};

module.exports = teacher;
