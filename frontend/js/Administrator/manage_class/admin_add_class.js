/**
 * Khi DOM được load xong, gọi API để lấy danh sách môn học (module),
 * sau đó render các option vào dropdown filter `#courseFilter`.
 */
document.addEventListener("DOMContentLoaded", async () => {
  listModule = await getModuleFilter();
  console.log("list filter: ", listModule);
  const moduleFilter = document.getElementById("courseFilter");
  moduleFilter.innerHTML = `<option value="">-- Chọn môn học --</option>`;

  listModule.forEach((item) => {
    const moduleItem = document.createElement("option");
    moduleItem.value = item.module_code;
    moduleItem.textContent = `${item.module_code} - ${item.module_name}`;
    moduleFilter.appendChild(moduleItem);
  });
});

/**
 * Lắng nghe sự kiện submit của form tạo lớp.
 * Lấy dữ liệu từ form và gọi hàm `createClassWithTeacher` để gửi về server.
 * Sau khi tạo thành công, đóng modal và reset form.
 */
document
  .getElementById("createClassForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const classID = document.getElementById("newTenLop").value.trim();
    const moduleID = document.getElementById("newTenMon").value.trim();
    const semesterID = document.getElementById("newHocKi").value.trim();
    const teacherCode = document.getElementById("newGiangVien").value.trim();

    await createClassWithTeacher(classID, moduleID, semesterID, teacherCode);

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("createClassModal")
    );
    modal.hide();
    modal.reset();
  });

/**
 * Gửi yêu cầu lấy danh sách các lớp học và học kỳ tương ứng từ backend.
 * Dữ liệu này được sử dụng trong modal tạo lớp.
 *
 * @returns {Promise<Array<Object>|undefined>} - Danh sách lớp và học kỳ.
 */
async function getClassCodeAndSemester() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getClassCodeAndSemester`);

    const result = await res.json();

    if (result.status === "success") {
      return result.data;
    } else {
      Swal.fire(
        "Lỗi",
        result.message || "Lấy danh sách lớp thất bại!",
        "error"
      );
    }
  } catch (err) {
    console.error("Lỗi khi gửi dữ liệu:", err);
    Swal.fire("Lỗi", "Không thể gửi yêu cầu lấy danh sách lớp!", "error");
  }
}

/**
 * Lấy danh sách tất cả môn học (module) từ backend.
 *
 * @returns {Promise<Array<Object>|undefined>} - Danh sách môn học.
 */
async function getModuleCode() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getModuleCode`);

    const result = await res.json();

    if (result.status === "success") {
      return result.data;
    } else {
      Swal.fire(
        "Lỗi",
        result.message || "Lấy danh sách lớp thất bại!",
        "error"
      );
    }
  } catch (err) {
    console.error("Lỗi khi gửi dữ liệu:", err);
    Swal.fire("Lỗi", "Không thể gửi yêu cầu lấy danh sách lớp!", "error");
  }
}

/**
 * Lấy danh sách môn học dùng để lọc danh sách lớp hiển thị.
 *
 * @returns {Promise<Array<Object>|undefined>} - Danh sách môn học để hiển thị trong dropdown lọc.
 */
async function getModuleFilter() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getModuleFilter`);

    const result = await res.json();

    if (result.status === "success") {
      return result.data;
    } else {
      Swal.fire(
        "Lỗi",
        result.message || "Lấy danh sách lớp thất bại!",
        "error"
      );
    }
  } catch (err) {
    console.error("Lỗi khi gửi dữ liệu:", err);
    Swal.fire("Lỗi", "Không thể gửi yêu cầu lấy danh sách lớp!", "error");
  }
}

/**
 * Lấy danh sách giảng viên từ backend.
 * Dữ liệu dùng để chọn giảng viên khi tạo lớp mới.
 *
 * @returns {Promise<Array<Object>|undefined>} - Danh sách giảng viên.
 */
async function getTeacherList() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getTeacherList`);
    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      return result.data;
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

/**
 * Gửi yêu cầu tạo lớp học mới với thông tin lớp, môn học, học kỳ, và giảng viên.
 * Nếu thành công, hiển thị thông báo và làm mới danh sách lớp học.
 *
 * @param {string} classID - ID lớp học được chọn.
 * @param {string} moduleID - ID môn học được chọn.
 * @param {string} semesterID - ID học kỳ được chọn.
 * @param {string} teacherCode - Mã giảng viên được chọn.
 * @returns {Promise<void>}
 */
async function createClassWithTeacher(
  classID,
  moduleID,
  semesterID,
  teacherCode
) {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/createClass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classID, moduleID, semesterID, teacherCode }),
    });

    const result = await res.json();

    if (result.status === "success") {
      await getModuleList();
      Swal.fire("Thành công", "Đã tạo tài lớp thành công!", "success");
    } else {
      Swal.fire("Lỗi", result.message || "Tạo lớp thất bại!", "error");
    }
  } catch (err) {
    console.error("Lỗi khi gửi dữ liệu:", err);
    Swal.fire("Lỗi", "Không thể gửi yêu cầu tạo lớp!", "error");
  }
}

/**
 * Khi modal `#createClassModal` hiển thị,
 * load dữ liệu lớp, học kỳ, môn học và giảng viên.
 * Tự động populate dropdown tương ứng.
 * Lắng nghe sự kiện thay đổi lớp để hiển thị các học kỳ phù hợp.
 */
document
  .getElementById("createClassModal")
  .addEventListener("show.bs.modal", async function (event) {
    classDataWithSemesters = await getClassCodeAndSemester();
    listModule = await getModuleCode();
    listTeacher = await getTeacherList();
    console.log("classDataWithSemesters:", classDataWithSemesters);
    console.log("listModule:", listModule);
    console.log("listTeacher:", listTeacher);

    const classSelect = document.getElementById("newTenLop");
    const semesterSelect = document.getElementById("newHocKi");
    const moduleSelect = document.getElementById("newTenMon");
    const teacherSelect = document.getElementById("newGiangVien");

    classSelect.innerHTML = `<option value="">-- Chọn lớp học --</option>`;
    semesterSelect.innerHTML = `<option value="">-- Chọn học kỳ --</option>`;
    moduleSelect.innerHTML = `<option value="">-- Chọn môn học --</option>`;
    teacherSelect.innerHTML = `<option value="">-- Chọn giảng viên --</option>`;

    semesterSelect.disabled = true;

    classDataWithSemesters.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.class.class_id;
      option.textContent = `${item.class.class_code} - ${item.class.class_name}`;
      classSelect.appendChild(option);
    });

    listModule.forEach((item) => {
      const moduleItem = document.createElement("option");
      moduleItem.value = item.module_id;
      moduleItem.textContent = `${item.module_code} - ${item.module_name}`;
      moduleSelect.appendChild(moduleItem);
    });

    listTeacher.forEach((item) => {
      const teacherItem = document.createElement("option");
      teacherItem.value = item.teacher_code;
      teacherItem.textContent = `${item.teacher_name}`;
      teacherSelect.appendChild(teacherItem);
    });

    classSelect.addEventListener("change", (e) => {
      const selectedId = parseInt(e.target.value);
      const selected = classDataWithSemesters.find(
        (item) => item.class.class_id === selectedId
      );
      semesterSelect.innerHTML = `<option value="">-- Chọn học kỳ --</option>`;
      if (selected) {
        semesterSelect.disabled = false;

        selected.semesters.forEach((sem) => {
          const opt = document.createElement("option");
          opt.value = sem.semester_id;
          opt.textContent = `Học kỳ ${sem.semester_number}`;
          semesterSelect.appendChild(opt);
        });
      } else {
        semesterSelect.disabled = true;
      }
    });
  });

/**
 * Khi người dùng thay đổi bộ lọc môn học `#courseFilter`,
 * lọc danh sách lớp hiện tại và hiển thị theo môn học được chọn.
 */
document.getElementById("courseFilter").addEventListener("change", function () {
  const keyword = this.value.trim().toLowerCase();

  const filtered = moduleDatas.filter((module) => {
    return (
      module.module_code.toLowerCase().includes(keyword) ||
      module.module_name.toLowerCase().includes(keyword)
    );
  });

  currentPage = 1;
  filterDatas = filtered;
  renderModuleList(filtered);
});
