document.addEventListener("DOMContentLoaded", function () {
  getStudentList();
});

function getParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    moduleCode: urlParams.get("module"),
    classCode: urlParams.get("class"),
    classSubjectId: urlParams.get("class_subject"),
    className: urlParams.get("class_name"),
    moduleName: urlParams.get("module_name"),
  };
}

async function getStudentCode(studentMiddleName, studentName) {
  if (!studentMiddleName || !studentName) {
    Swal.fire("Lỗi", "Không nhận được tên của sinh viên!", "error");
    return;
  }

  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/teacher/getStudentCodeByName?studentMiddleName=${studentMiddleName}&studentName=${studentName}`
    );

    const result = await res.json();

    if (result.status === "success" && result.data) {
      const studentCode = result.data;
      //   console.log("Student Code:", studentCode);
      return studentCode;
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

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

    const parsed = rows.map((row) => {
      const student_code = row["MÃ HS"] || row["MÃ\nHS"] || "";
      const hoDem = row["HỌ ĐỆM"] || row["Họ và tên đệm"] || "";
      const ten = row["TÊN"] || "";
      const score = row["Tổng điểm"] ?? row["Tổng\nđiểm"] ?? null;

      return { student_code, hoDem, ten, score };
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

async function parseNametoStudentCode(names) {
  names = names.slice(1); // Bỏ qua dòng tiêu đề
  if (!Array.isArray(names) || names.length === 0) {
    console.error("Danh sách tên không hợp lệ");
    Swal.fire("Lỗi", "Danh sách tên không hợp lệ!", "error");
    return [];
  }

  console.log("📄 Danh sách tên:", names);
  const studentCodes = [];

  for (const name of names) {
    if (name["hoDem"] && name["ten"]) {
      try {
        const studentCode = await getStudentCode(name["hoDem"], name["ten"]);
        if (!studentCode) {
          console.warn("⚠️ Không tìm thấy mã sinh viên cho:", name);
          Swal.fire(
            "Thông báo",
            `Không tìm thấy mã sinh viên cho: ${name.hoDem} ${name.ten}`,
            "warning"
          );
          continue;
        }
        studentCodes.push({
          student_code: studentCode,
          score: name.score ?? null,
        });
      } catch (err) {
        console.error("❌ Lỗi khi lấy mã sinh viên:", err);
        Swal.fire("Lỗi", "Không thể lấy mã sinh viên!", "error");
      }
    } else {
      console.warn("⚠️ Tên không hợp lệ:", name);
    }
  }

  return studentCodes;
}

async function importStudentScores(payload) {
  if (!payload || !payload.classSubjectId || !Array.isArray(payload.students)) {
    Swal.fire("Lỗi", "Dữ liệu không hợp lệ!", "error");
    console.error("Dữ liệu không hợp lệ:", payload);
    return;
  }

  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/teacher/importStudentScores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result.data.updatedCount === 0) {
      Swal.fire(
        "Thông báo",
        "Không có học sinh nào được cập nhật điểm!",
        "info"
      );
      return;
    }

    if (result.status === "success") {
      Swal.fire(
        "Thành công",
        `Nhập điểm thành công thành công cho ${result.data.updatedCount}! học sinh`,
        "success"
      ).then(() => {
        getStudentList();
      });
    } else {
      Swal.fire("Thông báo", "Không thể nhập điểm!", "warning");
      console.error("Lỗi khi nhập điểm:", result.message);
    }
  } catch (error) {
    console.error("❌ Lỗi khi gửi yêu cầu nhập điểm:", error);
    Swal.fire("Lỗi", "Lỗi khi gửi yêu cầu nhập điểm!", "error");
  }
}

document
  .getElementById("excelFile")
  .addEventListener("change", async function () {
    const file = this.files[0];
    const result = await parseExcelFile(file);
    const studentCodes = await parseNametoStudentCode(result);
    console.log("📄 Danh sách mã sinh viên:", studentCodes);
    const { classSubjectId } = getParams(); // lấy từ URL
    if (!classSubjectId) {
      Swal.fire("Lỗi", "Không xác định được mã lớp học!", "error");
      return;
    }

    const payload = {
      classSubjectId: classSubjectId,
      students: studentCodes,
    };
    await importStudentScores(payload);
  });
