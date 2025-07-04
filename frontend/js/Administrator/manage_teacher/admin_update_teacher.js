/**
 * Khi modal sửa thông tin giảng viên được hiển thị, tự động lấy dữ liệu từ nút trigger
 * và gán các giá trị vào các input trong form chỉnh sửa.
 */
document
  .getElementById("editTeacherModal")
  .addEventListener("show.bs.modal", async function (event) {
    const button = event.relatedTarget;
    const code = button.getAttribute("data-code");
    const name = button.getAttribute("data-name");
    const phone = button.getAttribute("data-phone");
    const gender = button.getAttribute("data-gender");
    const dateOfBirth = button.getAttribute("data-date-of-birth");
    const email = button.getAttribute("data-email");
    const address = button.getAttribute("data-address");
    const status = button.getAttribute("data-status");

    document.getElementById("editMaSo").value = code;
    document.getElementById("editHoTen").value = name;
    document.getElementById("editNgaySinh").value = dateOfBirth;
    document.getElementById("editGioiTinh").value = gender;
    document.getElementById("editDiaChi").value = address;
    document.getElementById("editEmail").value = email;
    document.getElementById("editSdt").value = phone;
    document.getElementById("editTrangThai").value = status;
  });

/**
 * Bắt sự kiện submit của form sửa giảng viên.
 * Thu thập dữ liệu từ form, đóng modal, reset form và gọi hàm cập nhật thông tin giảng viên.
 */
document
  .getElementById("editTeacherForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn reload trang
    const code = document.getElementById("editMaSo").value.trim();
    const name = document.getElementById("editHoTen").value.trim();
    const dateOfBirth = document.getElementById("editNgaySinh").value.trim();
    const gender = document.getElementById("editGioiTinh").value.trim();
    const address = document.getElementById("editDiaChi").value.trim();
    const email = document.getElementById("editEmail").value.trim();
    const phone = document.getElementById("editSdt").value.trim();
    const status = document.getElementById("editTrangThai").value.trim();

    const teacher = {
      teacher_code: code,
      teacher_name: name,
      teacher_date_of_birth: dateOfBirth,
      teacher_gender: gender,
      teacher_address: address,
      teacher_email: email,
      teacher_phone: phone,
      teacher_status: status,
    };

    bootstrap.Modal.getInstance(
      document.getElementById("editTeacherModal")
    ).hide();
    document.getElementById("editTeacherForm").reset();
    updateTeacherInfor(teacher);
  });

/**
 * Gửi yêu cầu cập nhật thông tin giảng viên đến backend.
 *
 * @param {Object} teacher - Đối tượng chứa dữ liệu giảng viên cần cập nhật
 * @param {string} teacher.teacher_code - Mã số giảng viên
 * @param {string} teacher.teacher_name - Họ và tên
 * @param {string} teacher.teacher_date_of_birth - Ngày sinh (YYYY-MM-DD)
 * @param {string} teacher.teacher_gender - Giới tính
 * @param {string} teacher.teacher_address - Địa chỉ
 * @param {string} teacher.teacher_email - Email
 * @param {string} teacher.teacher_phone - Số điện thoại
 * @param {string} teacher.teacher_status - Trạng thái giảng viên
 */
async function updateTeacherInfor(teacher) {
  if (!teacher) {
    Swal.fire("Lỗi", "Thiếu thông tin của học viên!", "error");
    return;
  }
  console.log("teacher", teacher);
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/updateTeacherInfor`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacher),
    });

    const data = await res.json();

    if (data.status === "success") {
      getTeacherList();
      Swal.fire("Thành công", "Thông tin đã được cập nhật!", "success");
    } else {
      Swal.fire(
        "Lỗi",
        data.message || "Không thể cập nhật thông tin giảng viên!",
        "error"
      );
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật!", "error");
  }
}
