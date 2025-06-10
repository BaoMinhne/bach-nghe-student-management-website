function handleLogout() {
  // Gọi API logout nếu muốn xoá session trên server
  fetch("http://localhost:3000/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  }).catch((err) => {
    console.warn("Không thể gọi logout từ server:", err.message);
  });

  Storage.clear();
  window.location.href = "../login/login.html";
}

// Gắn tự động nếu có phần tử logout nào
window.addEventListener("DOMContentLoaded", () => {
  const btns = [
    document.getElementById("logoutBtn"),
    document.getElementById("sidebarLogout"),
  ];

  btns.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", handleLogout);
    }
  });
});
