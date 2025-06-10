const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    if (!username || !password) {
      showToast("Please enter complete information!", "warn");
      return;
    }
    try {
      const API_BASE = "http://localhost:3000";
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.status === "success") {
        const { token, user } = result.data;
        Storage.saveUser(user, token);

        // Chuyển hướng theo phân quyền
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
            showToast("User role not determined!!!", "warn");
        }
      } else {
        showToast(`Login Fail: ${result.message}`, "error");
      }
    } catch (error) {
      console.error(error);
      showToast(`Unable to connect to server: ${error.message}`, "error");
    }
  });
} else {
  console.error("Không tìm thấy form đăng nhập!");
}
