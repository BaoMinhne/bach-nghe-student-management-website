/**
 * Khi DOM đã được tải hoàn tất, tự động lấy và hiển thị dữ liệu thống kê dashboard.
 */
document.addEventListener("DOMContentLoaded", async function () {
  getDashboardStats();
  const message = localStorage.getItem("loginSuccess");
  if (message) {
    // Hiển thị toast
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });

    // Xóa sau khi hiển thị
    localStorage.removeItem("loginSuccess");
  }
});

/**
 * Gửi request đến API backend để lấy dữ liệu thống kê tổng quan.
 * Nếu thành công, gọi hàm `renderStatData()` để hiển thị lên UI.
 */
async function getDashboardStats() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getDashboardStats`);
    const result = await res.json();

    if (result.status === "success") {
      const statDatas = result.data;
      console.log(statDatas);
      renderStatData(statDatas);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

/**
 * Hiển thị các số liệu thống kê lên giao diện người dùng.
 *
 * @param {Object} statDatas - Dữ liệu thống kê nhận từ server
 * @param {number} statDatas.total_classes - Tổng số lớp học
 * @param {number} statDatas.total_students - Tổng số học viên
 * @param {number} statDatas.total_teachers - Tổng số giảng viên
 * @param {number} statDatas.total_accounts - Tổng số tài khoản hệ thống
 */
function renderStatData(statDatas) {
  const total_class = statDatas.total_classes;
  const total_student = statDatas.total_students;
  const total_teacher = statDatas.total_teachers;
  const total_account = statDatas.total_accounts;
  document.getElementById("total-class").textContent = total_class;
  document.getElementById("total-student").textContent = total_student;
  document.getElementById("total-teacher").textContent = total_teacher;
  document.getElementById("total-account").textContent = total_account;
}
