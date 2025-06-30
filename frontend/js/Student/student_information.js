/**
 * Khởi chạy khi DOM đã tải xong.
 * Gọi các hàm để lấy và cập nhật thông tin sinh viên.
 */
document.addEventListener("DOMContentLoaded", function () {
  fetchStudentInfo();
  updateStudentInfo();
});

/**
 * Lấy thông tin sinh viên từ localStorage và gọi API để lấy chi tiết.
 * Hiển thị thông tin sinh viên lên trang và modal cập nhật.
 */
async function fetchStudentInfo() {
  const student = Storage.getUser();
  if (!student || !student.username) {
    Swal.fire("Lỗi", "Không xác định được sinh viên!", "error");
    return;
  }

  try {
    const API_BASE = "http://localhost:3000";
    const res = await fetch(
      `${API_BASE}/api/v1/student/getStudentInfo?studentCode=${student.username}`
    );
    const result = await res.json();

    if (result.status === "success") {
      displayStudentInfo(result.data);
      displayStudentInfoInModal(result.data);
    } else {
      Swal.fire("Thông báo", "Không tìm thấy thông tin sinh viên!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Không thể kết nối tới máy chủ!", "error");
  }
}

/**
 * Hiển thị thông tin sinh viên vào các thẻ trong trang chính.
 * @param {Object} info - Dữ liệu thông tin sinh viên từ API.
 */
function displayStudentInfo(info) {
  // Họ tên + mã số
  document.querySelector(
    ".studentFullName"
  ).textContent = `${info.student_middle_name} ${info.student_name}`;
  document.querySelector(".studentCode").textContent = info.student_code;

  // Thông tin cá nhân cơ bản
  document.querySelector(".studentMiddleName").textContent =
    info.student_middle_name;
  document.querySelector(".studentName").textContent = info.student_name;
  document.querySelector(".studentGender").textContent = formatGender(
    info.student_gender
  );
  document.querySelector(".studentDateOfBirth").textContent = formatDate(
    info.student_date_of_birth
  );

  // Thông tin liên hệ
  document.querySelector(".studentPhone").textContent = info.student_phone;
  document.querySelector(".studentIDCard").textContent = info.student_IDCard;
  document.querySelector(".studentAddress").textContent = info.student_address;
  document.querySelector(".studentEmail").textContent = info.student_email;
  document.querySelector(".studentCountry").textContent = info.student_country;
  document.querySelector(".studentBorn").textContent = info.student_country;

  // Trạng thái
  document.querySelector(".studentStatus").textContent = formatStatus(
    info.student_status
  );
}

/**
 * Định dạng ngày sinh sang kiểu hiển thị tiếng Việt.
 * @param {string} dateStr - Chuỗi ngày ISO.
 * @returns {string} - Ngày được định dạng dd/mm/yyyy.
 */
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN");
}

/**
 * Định dạng giới tính từ mã kỹ thuật sang tiếng Việt.
 * @param {string} gender - Mã giới tính ("male", "female", "other").
 * @returns {string} - Chuỗi giới tính tương ứng.
 */
function formatGender(gender) {
  return gender === "male" ? "Nam" : gender === "female" ? "Nữ" : "Khác";
}

/**
 * Định dạng trạng thái học tập.
 * @param {string} status - Trạng thái học ("studying", "graduated", "inactive").
 * @returns {string} - Chuỗi trạng thái tiếng Việt.
 */
function formatStatus(status) {
  switch (status) {
    case "studying":
      return "Đang học";
    case "graduated":
      return "Đã tốt nghiệp";
    case "inactive":
      return "Ngừng học";
    default:
      return "Không rõ";
  }
}

/**
 * Hiển thị thông tin sinh viên vào các input trong modal cập nhật.
 * @param {Object} info - Dữ liệu thông tin sinh viên từ API.
 */
function displayStudentInfoInModal(info) {
  document.getElementById("inputMiddleName").value =
    info.student_middle_name || "";
  document.getElementById("inputName").value = info.student_name || "";
  document.getElementById("inputGender").value = info.student_gender || "other";

  // Định dạng ngày sinh về yyyy-MM-dd cho input type="date"
  const dob = info.student_date_of_birth
    ? new Date(info.student_date_of_birth).toISOString().split("T")[0]
    : "";
  document.getElementById("inputDOB").value = dob;

  document.getElementById("inputPhone").value = info.student_phone || "";
  document.getElementById("inputEmail").value = info.student_email || "";
  document.getElementById("inputIDCard").value = info.student_IDCard || "";
  document.getElementById("inputBorn").value = info.student_country || "";
  document.getElementById("inputCountry").value = info.student_country || "";
  document.getElementById("inputAddress").value = info.student_address || "";
}

/**
 * Gửi yêu cầu cập nhật thông tin sinh viên lên server.
 * Lấy dữ liệu từ form modal và gọi API PUT.
 * Hiển thị thông báo phản hồi bằng Swal.
 */
function updateStudentInfo() {
  document
    .getElementById("updateStudentForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const student = Storage.getUser();
      if (!student || !student.username) {
        Swal.fire("Lỗi", "Không xác định được sinh viên!", "error");
        return;
      }

      const updatedData = {
        student_gender: document.getElementById("inputGender").value,
        student_date_of_birth: document.getElementById("inputDOB").value,
        student_phone: document.getElementById("inputPhone").value.trim(),
        student_email: document.getElementById("inputEmail").value.trim(),
        student_IDCard: document.getElementById("inputIDCard").value.trim(),
        student_country: document.getElementById("inputCountry").value.trim(),
        student_address: document.getElementById("inputAddress").value.trim(),
      };

      if (!updatedData.student_email.includes("@")) {
        Swal.fire("Lỗi", "Email không hợp lệ!", "error");
        return;
      }
      console.log("Sending data:", updatedData);

      try {
        const API_BASE = "http://localhost:3000";
        const res = await fetch(
          `${API_BASE}/api/v1/student/updateStudentInfo?studentCode=${student.username}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          }
        );

        const result = await res.json();

        if (result.status === "success") {
          Swal.fire(
            "Thành công",
            "Cập nhật thông tin thành công!",
            "success"
          ).then(() => {
            // Đóng modal, reload lại trang hoặc gọi fetch lại dữ liệu
            const modal = bootstrap.Modal.getInstance(
              document.getElementById("updateModal")
            );
            modal.hide();
            fetchStudentInfo(); // Gọi lại hàm để cập nhật UI
          });
        } else {
          Swal.fire("Thất bại", "Không thể cập nhật thông tin!", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Lỗi", "Có lỗi khi gửi yêu cầu đến máy chủ!", "error");
      }
    });
}
