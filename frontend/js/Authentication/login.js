/**
 * Xử lý sự kiện đăng nhập người dùng khi form được submit.
 * Gửi yêu cầu đến API xác thực, xử lý token và chuyển hướng dựa trên vai trò.
 */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    /**
     * Kiểm tra thông tin nhập vào. Nếu thiếu sẽ hiển thị cảnh báo bằng SweetAlert2.
     */
    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đầy đủ tài khoản và mật khẩu!",
      });
      return;
    }

    try {
      const API_BASE = "http://localhost:3000";

      /**
       * Gửi yêu cầu đăng nhập đến API backend.
       * @typedef {Object} LoginResponse
       * @property {string} status - Trạng thái phản hồi ("success" hoặc "fail")
       * @property {Object} data - Dữ liệu trả về khi thành công
       * @property {string} data.token - Token JWT xác thực
       * @property {Object} data.user - Thông tin người dùng
       * @property {number} data.user.role - Vai trò người dùng (0: admin, 1: student, 2: teacher)
       */

      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      /** @type {LoginResponse} */
      const result = await response.json();

      if (result.status === "success") {
        const { token, user } = result.data;

        // Lưu thông tin người dùng và token vào localStorage thông qua hàm Storage tự định nghĩa
        Storage.saveUser(user, token);

        // Lưu thông báo thành công để hiển thị tại trang sau đăng nhập
        localStorage.setItem(
          "loginSuccess",
          `Chào mừng ${user.username || "người dùng"} trở lại!`
        );

        /**
         * Chuyển hướng người dùng đến trang phù hợp theo role:
         * 0 - Admin
         * 1 - Student
         * 2 - Teacher
         */
        switch (user.role) {
          case 0:
            window.location.href = "../admin/page_admin.html";
            break;
          case 1:
            window.location.href = "../student/page_student.html";
            break;
          case 2:
            window.location.href = "../teacher/page_teacher_home.html";
            break;
          default:
            Swal.fire(
              "Cảnh báo",
              "Không xác định vai trò người dùng!",
              "warning"
            );
        }
      } else {
        // Đăng nhập thất bại
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại",
          text: result.message || "Sai tài khoản hoặc mật khẩu!",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: `Không thể kết nối đến máy chủ: ${error.message}`,
      });
    }
  });
} else {
  console.error("Không tìm thấy form đăng nhập!");
}
