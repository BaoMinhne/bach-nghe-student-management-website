/**
 * Khi modal học viên hiển thị, tự động gán mã học viên vào input.
 */
document
  .getElementById("editModal")
  .addEventListener("show.bs.modal", async function (event) {
    const button = event.relatedTarget;
    const studentCode = button.getAttribute("data-student-code");
    const middle_name = button.getAttribute("data-middle-name");
    const name = button.getAttribute("data-name");
    const status = button.getAttribute("data-status");

    document.getElementById("editMaSV").value = studentCode;
    document.getElementById("editHoDem").value = middle_name;
    document.getElementById("editTen").value = name;
    document.getElementById("editTrangThai").value = status;
  });

document
  .getElementById("editStudentForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn reload trang
    const code = document.getElementById("editMaSV").value.trim();
    const middle_name = document.getElementById("editHoDem").value.trim();
    const name = document.getElementById("editTen").value.trim();
    const stauts = document.getElementById("editTrangThai").value.trim();
    const student = {
      student_code: code,
      student_middle_name: middle_name,
      student_name: name,
      student_status: stauts,
    };

    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();

    updateStudentInfor(student);
  });

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
      getStudentList();
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
