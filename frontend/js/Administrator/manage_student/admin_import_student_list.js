document.addEventListener("DOMContentLoaded", function () {
  getLastStudentCode();
});

/**
 * Chuyển đổi mã ngày dạng số serial từ Excel sang định dạng dd/mm/yyyy.
 * @param {number} serial - Mã ngày dạng số (Excel serial date)
 * @returns {string} - Ngày ở định dạng dd/mm/yyyy
 */

function formatDate(serial) {
  const utc_days = Math.floor(serial - 25569); // Excel's base date offset
  const utc_value = utc_days * 86400; // seconds
  const date = new Date(utc_value * 1000);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Đọc và phân tích nội dung file Excel để chuyển thành danh sách học viên.
 * @param {File} file - File Excel được chọn từ input
 * @returns {Promise<Array<Object>|null>} - Mảng học viên đã xử lý hoặc null nếu lỗi
 */

async function parseExcelFile(file) {
  if (!file) {
    console.error("Không có file Excel được chọn");
    Swal.fire("Lỗi", "Không có file Excel được chọn!", "");
    return null;
  }

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { range: 7 });

    if (rows.length === 0) {
      console.warn("File Excel không có dữ liệu.");
      Swal.fire("Lỗi", "File Excel không có dữ liệu!", "error");
      return null;
    }
    const formatDatas = rows.slice(1, -1);

    const lastStudentCode = await getLastStudentCode();
    const trimmed = lastStudentCode.slice(0, 4);
    let convertNumber = Number(trimmed);

    const parsed = formatDatas.map((row) => {
      let student_code = row["MÃ HS"] || row["MÃ\nHS"] || "";
      const student_middle_name = row["HỌ ĐỆM"] || row["Họ và tên đệm"] || "";
      const student_name = row["TÊN"] || "";
      let ngaySinh = row["NGÀY SINH"] || "";
      const student_date_of_birth = isNaN(ngaySinh)
        ? ngaySinh
        : formatDate(ngaySinh);

      if (!student_code || student_code.trim() === "") {
        convertNumber++;
        const formattedNumber = String(convertNumber).padStart(4, "0"); // → "0140"
        student_code = `${formattedNumber}/25-THUD`;
      }

      return {
        student_code,
        student_middle_name,
        student_name,
        student_date_of_birth,
      };
    });

    if (parsed.length === 0) {
      console.warn("Không có dữ liệu hợp lệ trong file Excel.");
      Swal.fire("Lỗi", "Không có dữ liệu hợp lệ trong file Excel!", "error");
      return null;
    }

    return parsed;
  } catch (err) {
    console.error("❌ Lỗi khi đọc file Excel:", err);
    return null;
  }
}

/**
 * Gọi API để lấy mã học viên cuối cùng hiện có trong hệ thống.
 * @returns {Promise<string|undefined>} - Mã học viên cuối nếu thành công
 */

async function getLastStudentCode() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getLastStudentCode`);

    const result = await res.json();

    if (result.status === "success" && result.data) {
      const lastStudentCode = result.data.student_code;
      //   console.log("Student Code:", lastStudentCode);
      return lastStudentCode;
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

/**
 * Gửi danh sách học viên đã xử lý lên server để thêm vào hệ thống.
 * @param {Array<Object>} payload - Danh sách học viên để import
 */

async function importStudentList(payload) {
  if (!payload || !Array.isArray(payload)) {
    Swal.fire("Lỗi", "Dữ liệu không hợp lệ!", "error");
    console.error("Dữ liệu không hợp lệ:", payload);
    return;
  }

  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/importStudentList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result.data.insertedCount === 0) {
      Swal.fire(
        "Thông báo",
        "Không có học sinh nào được thêm vào hệ thống!",
        "info"
      );
      return;
    }

    if (result.status === "success") {
      Swal.fire(
        "Thành công",
        `Đã thêm ${result.data.insertedCount}! vào hệ thống`,
        "success"
      ).then(() => {
        getStudentList();
      });
    } else {
      Swal.fire("Thông báo", "Không thể thêm dữ liệu!", "warning");
      console.error("Lỗi khi thêm dữ liệu:", result.message);
    }
  } catch (error) {
    console.error("❌ Lỗi khi thêm dữ liệu:", error);
    Swal.fire("Lỗi", "Lỗi khi thêm dữ liệu!", "error");
  }
}

/**
 * Bắt sự kiện chọn file Excel, xử lý và gửi dữ liệu lên server.
 */

document
  .getElementById("excelFile")
  .addEventListener("change", async function () {
    const file = this.files[0];
    const result = await parseExcelFile(file);
    // const studentCodes = await parseNametoStudentCode(result);
    console.log("📄 Danh sách sinh viên:", result);

    await importStudentList(result);
  });
