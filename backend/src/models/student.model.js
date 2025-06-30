const knex = require("../database/knex");

const student = {
  /**
   * Lấy tất cả điểm của học viên theo mã học viên.
   * @param {string} studentCode - Mã học viên.
   * @returns {Promise<Array<Object>>} Danh sách điểm theo từng môn học và học kỳ.
   */
  getAllSubjectScore: async (studentCode) => {
    const result = await knex("student as s")
      .join("class_student as cs", "s.student_code", "cs.student_code")
      .join(
        "class_subject as csub",
        "cs.class_subject_id",
        "csub.class_subject_id"
      )
      .join("class as c", "csub.class_id", "c.class_id")
      .join("module as m", "csub.module_id", "m.module_id")
      .join("semester as se", "csub.semester_id", "se.semester_id")
      .join("score as sc", function () {
        this.on("cs.class_subject_id", "=", "sc.class_subject_id").andOn(
          "s.student_code",
          "=",
          "sc.student_code"
        );
      })
      .where("s.student_code", studentCode)
      .distinct(
        "s.student_code as MÃ HS",
        "s.student_middle_name as HỌ ĐỆM",
        "s.student_name as TÊN",
        "m.module_code as Mã Môn học",
        "m.module_name as Tên Môn học",
        "c.class_name AS Đơn Vị Học",
        "se.semester_number as Học kỳ",
        "se.semester_start_date as Ngày bắt đầu",
        "se.semester_end_date as Ngày kết thúc",
        "sc.score as Tổng điểm"
      )
      .orderBy("m.module_code");

    return result;
  },

  /**
   * Lọc điểm của học viên theo học kỳ.
   * @param {string} studentCode - Mã học viên.
   * @param {number|string} semester - Số thứ tự học kỳ (VD: 1, 2, 3...).
   * @returns {Promise<Array<Object>>} Danh sách điểm lọc theo học kỳ.
   */
  filterSubjectScoreBySemester: async (studentCode, semester) => {
    const result = await knex("student as s")
      .join("class_student as cs", "s.student_code", "cs.student_code")
      .join(
        "class_subject as csub",
        "cs.class_subject_id",
        "csub.class_subject_id"
      )
      .join("class as c", "csub.class_id", "c.class_id")
      .join("module as m", "csub.module_id", "m.module_id")
      .join("semester as se", "csub.semester_id", "se.semester_id")
      .join("score as sc", function () {
        this.on("cs.class_subject_id", "=", "sc.class_subject_id").andOn(
          "s.student_code",
          "=",
          "sc.student_code"
        );
      })
      .where("s.student_code", studentCode)
      .andWhere("se.semester_number", semester)
      .distinct(
        "s.student_code as MÃ HS",
        "s.student_middle_name as HỌ ĐỆM",
        "s.student_name as TÊN",
        "m.module_code as Mã Môn học",
        "m.module_name as Tên Môn học",
        "c.class_name AS Đơn Vị Học",
        "se.semester_number as Học kỳ",
        "se.semester_start_date as Ngày bắt đầu",
        "se.semester_end_date as Ngày kết thúc",
        "sc.score as Tổng điểm"
      )
      .orderBy("m.module_code");

    return result;
  },

  /**
   * Lấy thông tin chi tiết của một học viên.
   * @param {string} studentCode - Mã học viên.
   * @returns {Promise<Object|null>} Thông tin học viên hoặc null nếu không tìm thấy.
   */
  getStudentInfo: async (studentCode) => {
    const result = await knex("student").where("student_code", studentCode);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  },

  /**
   * Cập nhật thông tin của học viên.
   * @param {string} studentCode - Mã học viên cần cập nhật.
   * @param {Object} updateData - Dữ liệu cần cập nhật.
   * @param {string} [updateData.student_date_of_birth]
   * @param {string} updateData.student_address
   * @param {string} updateData.student_email
   * @param {string} updateData.student_phone
   * @param {string} updateData.student_IDCard
   * @param {string} updateData.student_country
   * @param {string} updateData.student_gender
   * @returns {Promise<number|null>} Số lượng bản ghi cập nhật hoặc null nếu không cập nhật.
   */
  updateStudentInfo: async (studentCode, updateData) => {
    const result = await knex("student")
      .where("student_code", studentCode)
      .update({
        student_date_of_birth: updateData.student_date_of_birth,
        student_address: updateData.student_address,
        student_email: updateData.student_email,
        student_phone: updateData.student_phone,
        student_IDCard: updateData.student_IDCard,
        student_country: updateData.student_country,
        student_gender: updateData.student_gender,
      });

    if (result === 0) {
      return null;
    }
    return result;
  },

  /**
   * Lấy danh sách chứng chỉ của học viên.
   * @param {string} student_code - Mã học viên.
   * @returns {Promise<Array<Object>|null>} Danh sách chứng chỉ hoặc null nếu không có.
   */
  getCertificatesOfStudent: async (student_code) => {
    const certs = await knex("certificate as c")
      .join("student as s", "c.student_code", "s.student_code")
      .join(
        "class_subject as csj",
        "c.class_subject_id",
        "csj.class_subject_id"
      )
      .join("class as cl", "csj.class_id", "cl.class_id")
      .join("module as m", "csj.module_id", "m.module_id")
      .where("c.student_code", student_code)
      .select(
        "c.cert_number as so_hieu",
        "s.student_code as ma_so",
        knex.raw("CONCAT(s.student_middle_name, ' ', s.student_name) as ten"),
        "s.student_IDCard as so_CMND",
        "cl.class_name as lop",
        "m.module_code as ma_mon",
        "m.module_name as ten_mon",
        "c.issued_date as ngay_cap"
      );

    if (certs.length == 0) return null;

    return certs;
  },
};

module.exports = student;
