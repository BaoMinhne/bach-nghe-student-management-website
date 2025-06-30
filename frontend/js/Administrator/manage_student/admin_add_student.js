document.addEventListener("DOMContentLoaded", async () => {
  const newCode = await getNewCode();
  console.log("after format code: " + newCode);
});

/**
 * Gửi yêu cầu đến backend để lấy mã học viên cuối cùng hiện tại.
 * @returns {Promise<string|undefined>} - Mã học viên cuối nếu thành công
 */

async function getLastStudentCode() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getLastStudentCode`);

    const result = await res.json();

    if (result.status === "success" && result.data) {
      const lastStudentCode = result.data.student_code;
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
 * Tăng số thứ tự của mã học viên lên 1 và định dạng lại.
 * @param {string} studentCode - Mã học viên hiện tại dạng chuỗi
 * @returns {string|null} - Mã mới được định dạng hoặc null nếu lỗi
 */

function formatStudentCode(studentCode) {
  if (!studentCode) {
    Swal.fire("Thông báo", "Không lấy được mã học viên cuối!", "warning");
    return null;
  }

  const oldCode = studentCode;
  const numberPart = oldCode.slice(0, 4);
  let newNumber = Number(numberPart) + 1;

  const formattedNumber = String(newNumber).padStart(4, "0");
  const newCode = `${formattedNumber}/25-THUD`;
  return newCode;
}

/**
 * Lấy mã học viên cuối và tạo mã học viên mới.
 * @returns {Promise<string|null>} - Mã mới được tạo
 */
async function getNewCode() {
  const beforeFormat = await getLastStudentCode();
  const afterFormat = formatStudentCode(beforeFormat);
  return afterFormat;
}

/**
 * Khi modal thêm học viên hiển thị, tự động gán mã học viên mới vào input.
 */
document
  .getElementById("addStudentModal")
  .addEventListener("show.bs.modal", async function (event) {
    // const button = event.relatedTarget; // nút gọi modal
    const newCode = await getNewCode();
    const student_code = document.getElementById("maSo");
    student_code.value = newCode; // gán giá trị vào input
  });

/**
 * Gửi thông tin học viên mới đến backend để thêm vào hệ thống.
 * @param {Object} student - Đối tượng học viên chứa các trường cần thiết
 */
async function addNewStudent(student) {
  if (!student) {
    Swal.fire("Cảnh Báo", "Không nhận được dữ liệu nhập vào!!!", "error");
    console.error("Thiếu dữ liệu cần thiết");
    return;
  }

  console.log(student);

  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/addNewStudent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    const data = await res.json();

    if (data.status === "success") {
      Swal.fire("Thành công", "Thêm dữ liệu thành công!", "success");
      getStudentList();
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
document.getElementById("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Ngăn form reload trang

  const student = {
    student_code: document.getElementById("maSo").value.trim(),
    student_middle_name: document.getElementById("hoDem").value.trim(),
    student_name: document.getElementById("tenHocVien").value.trim(),
    student_phone: document.getElementById("sdt").value.trim(),
  };

  // Gửi dữ liệu lên server
  await addNewStudent(student);

  // Đóng modal sau khi thêm
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addStudentModal")
  );
  modal.hide();

  // Reset form
  document.getElementById("studentForm").reset();
});
