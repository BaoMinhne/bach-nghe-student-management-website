/**
 * Xử lý đăng xuất người dùng khỏi hệ thống.
 *
 * Gọi API `/logout` để hủy phiên trên server (nếu áp dụng),
 * sau đó xóa dữ liệu người dùng khỏi `localStorage/sessionStorage` (thông qua Storage),
 * và chuyển hướng người dùng về trang đăng nhập.
 */
function handleLogout() {
  // Gọi API logout để hủy session phía server (nếu cần)
  fetch("http://localhost:3000/api/v1/auth/logout", {
    method: "POST",
    credentials: "include", // Bao gồm cookie khi gửi request
  }).catch((err) => {
    console.warn("Không thể gọi logout từ server:", err.message);
  });

  // Xóa toàn bộ dữ liệu lưu trữ của người dùng ở phía client
  Storage.clear();

  // Chuyển hướng người dùng về trang đăng nhập
  window.location.href = "../login/login.html";
}

/**
 * Khi DOM được tải xong, tự động gắn sự kiện `click` vào các nút đăng xuất
 * nếu chúng tồn tại trong DOM.
 */
window.addEventListener("DOMContentLoaded", () => {
  const btns = [
    document.getElementById("logoutBtn"),
    document.getElementById("sidebarLogout"),
  ];

  /**
   * Gắn sự kiện `click` để gọi hàm `handleLogout` cho từng nút.
   * Dùng để đảm bảo mọi giao diện logout đều hoạt động.
   */
  btns.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", handleLogout);
    }
  });
});
