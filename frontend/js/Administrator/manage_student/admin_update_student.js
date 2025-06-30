/**
 * Khi modal chỉnh sửa học viên hiển thị, tự động gán thông tin học viên vào các ô input.
 */
document
  .getElementById("editModal")
  .addEventListener("show.bs.modal", async function (event) {
    /** @type {HTMLElement} */
    const button = event.relatedTarget;

    /** @type {string} Mã số sinh viên */
    const studentCode = button.getAttribute("data-student-code");

    /** @type {string} Họ đệm */
    const middle_name = button.getAttribute("data-middle-name");

    /** @type {string} Tên */
    const name = button.getAttribute("data-name");

    /** @type {string} Trạng thái */
    const status = button.getAttribute("data-status");

    // Gán giá trị vào các trường trong form
    document.getElementById("editMaSV").value = studentCode;
    document.getElementById("editHoDem").value = middle_name;
    document.getElementById("editTen").value = name;
    document.getElementById("editTrangThai").value = status;
  });

/**
 * Xử lý sự kiện submit form cập nhật thông tin học viên.
 */
document
  .getElementById("editStudentForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn form reload trang

    // Lấy giá trị từ các input
    const code = document.getElementById("editMaSV").value.trim();
    const middle_name = document.getElementById("editHoDem").value.trim();
    const name = document.getElementById("editTen").value.trim();
    const stauts = document.getElementById("editTrangThai").value.trim(); // typo: 'stauts' nên sửa thành 'status'

    /** @type {{student_code: string, student_middle_name: string, student_name: string, student_status: string}} */
    const student = {
      student_code: code,
      student_middle_name: middle_name,
      student_name: name,
      student_status: stauts,
    };

    // Đóng modal sau khi submit
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();

    // Gọi API cập nhật
    updateStudentInfor(student);
  });

/**
 * Gửi yêu cầu cập nhật thông tin học viên lên server.
 *
 * @param {{student_code: string, student_middle_name: string, student_name: string, student_status: string}} student - Đối tượng thông tin học viên.
 */
async function updateStudentInfor(student) {
  if (!student) {
    Swal.fire("Lỗi", "Thiếu thông tin của học viên!", "error");
    return;
  }

  const API_BASE = "http://localhost:3000";

  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/updateStudentInfor`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    const data = await res.json();

    if (data.status === "success") {
      Swal.fire("Thành công", "Thông tin đã được cập nhật!", "success");
      getStudentList?.(); // Làm mới danh sách nếu hàm tồn tại
    } else {
      Swal.fire(
        "Lỗi",
        data.message || "Không thể cập nhật thông tin học viên!",
        "error"
      );
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật!", "error");
  }
}
