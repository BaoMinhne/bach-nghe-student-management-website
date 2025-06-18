document.addEventListener("DOMContentLoaded", function () {
  getTeacherInformation();
});

async function getTeacherInformation() {
  const teacher = Storage.getUser();
  if (!teacher || !teacher.username) {
    Swal.fire("Lỗi", "Không xác định được giảng viên!", "error");
    return;
  }
  console.log("Teacher Information:", teacher.username);
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/teacher/getTeacherInfo?teacherCode=${teacher.username}`
    );

    const result = await res.json();

    if (result.status === "success" && result.data) {
      const teacherInfo = result.data;
      console.log("Teacher Information Data:", teacherInfo);
      renderDropdownMenu(teacherInfo);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

function renderDropdownMenu(teacherInfo) {
  const name = teacherInfo.teacher_name || "Giảng viên";
  document.querySelectorAll(".teacher_name").forEach((el) => {
    el.textContent = name;
  });
}
