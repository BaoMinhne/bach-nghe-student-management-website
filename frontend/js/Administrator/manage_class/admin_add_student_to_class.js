/**
 * Lắng nghe sự kiện submit của form `#addStudentForm`.
 * Kiểm tra các checkbox đã chọn học sinh chưa, sau đó gửi yêu cầu thêm học sinh vào lớp.
 */
document
  .getElementById("addStudentForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const students = selectedRows();
    if (students.length === 0) {
      Swal.fire("Thông báo", "Bạn chưa chọn học sinh nào!", "warning");
      return;
    }

    await addStudentsToClass(students);
  });

/**
 * Lấy danh sách mã học sinh từ các hàng đã được chọn (checkbox).
 *
 * @returns {Array<string>} - Mảng mã học sinh đã được chọn.
 */
function selectedRows() {
  const checkboxes = document.querySelectorAll(".checkbox-input");
  const students = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest("tr");
      const studentCode = row
        .querySelector("td:nth-child(3)")
        .textContent.trim();
      students.push(studentCode);
    }
  });

  return students;
}

/**
 * Gửi danh sách mã học sinh được chọn đến backend để thêm vào lớp học phần.
 * Nếu thành công, gọi lại hàm `getStudentNotInClass` để cập nhật danh sách.
 *
 * @param {Array<string>} datas - Mảng mã học sinh.
 * @returns {Promise<void>}
 */
async function addStudentsToClass(datas) {
  const classSubject = getParams();

  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/addStudentsToClass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        class_subject_id: classSubject.class_subject_id,
        student_codes: datas,
      }),
    });

    const result = await res.json();

    if (result.status === "success") {
      await getStudentNotInClass();
      Swal.fire("Thành công", "Đã thêm thành công!", "success");
    } else {
      Swal.fire("Lỗi", result.message || "Thêm thất bại!", "error");
    }
  } catch (err) {
    console.error("Lỗi khi gửi dữ liệu:", err);
    Swal.fire("Lỗi", "Không thể gửi yêu cầu thêm!", "error");
  }
}
