document.addEventListener("DOMContentLoaded", async () => {
  const newCode = await getNewCode();
  const oldCode = await getLastTeacherCode();
  console.log("after format code: " + newCode);
  console.log("old code: " + oldCode);
});

/**
 * Gửi yêu cầu đến backend để lấy mã học viên cuối cùng hiện tại.
 * @returns {Promise<string|undefined>} - Mã học viên cuối nếu thành công
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
 * Tăng số thứ tự của mã học viên lên 1 và định dạng lại.
 * @param {string} teacherCode - Mã học viên hiện tại dạng chuỗi
 * @returns {string|null} - Mã mới được định dạng hoặc null nếu lỗi
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
 * Lấy mã học viên cuối và tạo mã học viên mới.
 * @returns {Promise<string|null>} - Mã mới được tạo
 */
async function getNewCode() {
  const beforeFormat = await getLastTeacherCode();
  const afterFormat = formatTeacherCode(beforeFormat);
  return afterFormat;
}

/**
 * Khi modal thêm học viên hiển thị, tự động gán mã học viên mới vào input.
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
 * Gửi thông tin học viên mới đến backend để thêm vào hệ thống.
 * @param {Object} student - Đối tượng học viên chứa các trường cần thiết
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
 * Lắng nghe sự kiện submit form thêm học viên.
 * Tạo object học viên, gọi hàm thêm và reset form sau khi hoàn tất.
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
