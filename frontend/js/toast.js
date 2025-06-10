function showToast(message, type = "info") {
  const bgColors = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #e52d27, #b31217)",
    info: "linear-gradient(to right, #2193b0, #6dd5ed)",
    warn: "linear-gradient(to right, #f7971e, #ffd200)",
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warn: "⚠️",
  };

  const icon = icons[type] || "";
  const textWithIcon = `<span style="display:flex;align-items:center;gap:6px;">${icon} ${message}</span>`;

  Toastify({
    text: textWithIcon,
    duration: 3000,
    close: false,
    gravity: "top",
    position: "right",
    backgroundColor: bgColors[type] || bgColors.info,
    stopOnFocus: true,
    escapeMarkup: false, // <--- Cho phép hiển thị HTML
  }).showToast();
}

window.showToast = showToast;
