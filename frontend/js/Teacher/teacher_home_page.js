document.addEventListener("DOMContentLoaded", function () {
  getModules();
});

async function getModules() {
  const teacher = Storage.getUser();
  if (!teacher || !teacher.username) {
    Swal.fire("Lỗi", "Không xác định được giảng viên!", "error");
    return;
  }
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/teacher/getModuleTeaching?teacherCode=${teacher.username}`
    );

    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      const modules = result.data;
      renderModulesList(modules);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

function renderModulesList(modules) {
  const moduleList = document.querySelector(".module-list");
  moduleList.innerHTML = ""; // Xoá nội dung cũ

  modules.forEach((module) => {
    const div = document.createElement("div");
    div.className = "col-md-3 col-sm-6";
    div.innerHTML = `
	<div class="card shadow-sm ">
        <img
          src="../images/b1.jpg"
          class="card-img-top"
          alt="..."
        />
        <div class="card-body">
          <h5 class="card-title marquee-hover">
            <span>${module["module_code"]} - ${module["module_name"]}</span>
          </h5>
          <p class="card-text marquee-hover">
            <span>${module["teacher_name"]}</span>
          </p>
          <p class="card-text card_class_name marquee-hover">
            <span>Class: ${module["class_name"]}</span>
          </p>
          <button class="btn btn-primary"
			onclick="location.href='page_student_list.html?module=${module["module_code"]}&class=${module["class_code"]}&class_subject=${module["class_subject_id"]}&class_name=${module["class_name"]}&module_name=${module["module_name"]}'">
			Access
		  </button>
        </div>
	</div>
	`;
    moduleList.appendChild(div);
  });
}
