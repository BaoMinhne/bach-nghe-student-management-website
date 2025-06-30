/**
 * Khi tài liệu HTML được tải xong:
 * - Tự động lấy mã giáo viên mới và mã cuối cùng hiện tại để hiển thị trong console.
 */
document.addEventListener("DOMContentLoaded", async () => {
  const newCode = await getNewCode();
  const oldCode = await getLastTeacherCode();
  console.log("after format code: " + newCode);
  console.log("old code: " + oldCode);
});

/**
 * Gửi yêu cầu đến backend để lấy mã giáo viên cuối cùng đã có trong hệ thống.
 *
 * @returns {Promise<string|undefined>} - Mã giáo viên cuối nếu thành công, ngược lại trả về `undefined`.
 */
async function getLastTeacherCode() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getLastTeacherCode`);

    const result = await res.json();

    if (result.status === "success" && result.data) {
      const lastTeacherCode = result.data.teacher_code;
      return lastTeacherCode;
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

/**
 * Tăng số thứ tự trong mã giáo viên cũ và định dạng lại theo quy chuẩn.
 *
 * @param {string} teacherCode - Mã giáo viên hiện tại (ví dụ: "GV00012")
 * @returns {string|null} - Mã mới (ví dụ: "GV00013"), hoặc null nếu có lỗi.
 */
function formatTeacherCode(teacherCode) {
  if (!teacherCode) {
    Swal.fire("Thông báo", "Không lấy được mã học viên cuối!", "warning");
    return null;
  }

  const oldCode = teacherCode;
  const numberPart = oldCode.slice(2); // bỏ 'GV'
  const newNumber = parseInt(numberPart, 10) + 1;

  // Format lại với padding
  const newCode = String(newNumber).padStart(5, "0");
  return `GV${newCode}`;
}

/**
 * Lấy mã giáo viên cuối cùng từ hệ thống và trả về mã mới được định dạng.
 *
 * @returns {Promise<string|null>} - Mã giáo viên mới (ví dụ: "GV00013")
 */
async function getNewCode() {
  const beforeFormat = await getLastTeacherCode();
  const afterFormat = formatTeacherCode(beforeFormat);
  return afterFormat;
}

/**
 * Khi modal "Thêm giáo viên" được mở, tự động gán mã giáo viên mới vào ô input.
 */
document
  .getElementById("addTeacherModal")
  .addEventListener("show.bs.modal", async function (event) {
    // const button = event.relatedTarget; // nút gọi modal
    const newCode = await getNewCode();
    const teacher_code = document.getElementById("maSo");
    teacher_code.value = newCode; // gán giá trị vào input
  });

/**
 * Gửi dữ liệu giáo viên mới lên server thông qua API.
 *
 * @param {Object} teacher - Đối tượng giáo viên cần thêm.
 * @param {string} teacher.teacher_code
 * @param {string} teacher.teacher_name
 * @param {string} teacher.teacher_date_of_birth
 * @param {string} teacher.teacher_gender
 * @param {string} teacher.teacher_address
 * @param {string} teacher.teacher_email
 * @param {string} teacher.teacher_phone
 */
async function addNewTeacher(teacher) {
  if (!teacher) {
    Swal.fire("Cảnh Báo", "Không nhận được dữ liệu nhập vào!!!", "error");
    console.error("Thiếu dữ liệu cần thiết");
    return;
  }

  console.log(teacher);

  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/addNewTeacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacher),
    });

    const data = await res.json();

    if (data.status === "success") {
      Swal.fire("Thành công", "Thêm dữ liệu thành công!", "success");
      getTeacherList();
    } else {
      Swal.fire("Lỗi", data.message || "Không thể thêm dữ liệu!", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật điểm!", "error");
  }
}

/**
 * Lắng nghe sự kiện submit của form thêm giáo viên.
 * - Tạo object giáo viên từ input form.
 * - Gửi dữ liệu lên server.
 * - Đóng modal và reset form sau khi thêm thành công.
 */
document.getElementById("teacherForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Ngăn form reload trang

  const teacher = {
    teacher_code: document.getElementById("maSo").value.trim(),
    teacher_name: document.getElementById("hoTen").value.trim(),
    teacher_date_of_birth: document.getElementById("ngaySinh").value.trim(),
    teacher_gender: document.getElementById("gioiTinh").value.trim(),
    teacher_address: document.getElementById("diaChi").value.trim(),
    teacher_email: document.getElementById("email").value.trim(),
    teacher_phone: document.getElementById("sdt").value.trim(),
  };
  console.log(document.getElementById("ngaySinh").value.trim());

  // Gửi dữ liệu lên server
  await addNewTeacher(teacher);

  // Đóng modal sau khi thêm
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addTeacherModal")
  );
  modal.hide();

  // Reset form
  document.getElementById("teacherForm").reset();
});
