/**
 * Biến toàn cục
 * @type {string|null}
 */
let classSubjectID = null;

/**
 * Sự kiện được gọi khi modal chỉnh sửa lớp học phần được hiển thị.
 * - Lấy danh sách học kỳ và giảng viên
 * - Đổ dữ liệu từ nút trigger vào form modal
 * - Gán các giá trị đã chọn vào các ô input tương ứng trong modal
 *
 * @param {Event} event - Sự kiện Bootstrap modal show
 */
document
  .getElementById("editClassModal")
  .addEventListener("show.bs.modal", async function (event) {
    const trigger = event.relatedTarget;
    classDataWithSemesters = await getClassCodeAndSemester();
    console.log("classDataWithSemesters", classDataWithSemesters);
    listTeacher = await getTeacherList();
    const teacherSelect = document.getElementById("editTeacher");
    teacherSelect.innerHTML = `<option value="" disabled>-- Chọn giảng viên --</option>`;
    listTeacher.forEach((item) => {
      const teacherItem = document.createElement("option");
      teacherItem.value = item.teacher_code;
      teacherItem.textContent = `${item.teacher_name}`;
      teacherSelect.appendChild(teacherItem);
    });

    // Lấy dữ liệu từ nút được click
    classSubjectID = trigger.getAttribute("data-class-subject-id");
    console.log("classSubjectID", classSubjectID);
    const classId = trigger.getAttribute("data-class-id");
    const classCode = trigger.getAttribute("data-class-code");
    const className = trigger.getAttribute("data-class-name");
    const moduleId = trigger.getAttribute("data-module-id");
    const moduleCode = trigger.getAttribute("data-module-code");
    const moduleName = trigger.getAttribute("data-module-name");
    const teacherCode = trigger.getAttribute("data-teacher-code");
    // const teacherName = trigger.getAttribute("data-teacher-name");
    const semesterId = trigger.getAttribute("data-semester-id");
    const status = trigger.getAttribute("data-status");

    document.getElementById(
      "editClassName"
    ).innerHTML = `<option value="${classId}">${classCode} - ${className}</option>`;

    document.getElementById(
      "editModule"
    ).innerHTML = `<option value="${moduleId}">${moduleCode} - ${moduleName}</option>`;

    document.getElementById("editTeacher").value = teacherCode;
    document.getElementById("editStatus").value = status;

    const semesterSelect = document.getElementById("editSemester");
    semesterSelect.innerHTML = `<option value="" disabled>-- Chọn học kỳ --</option>`;

    const selected = classDataWithSemesters.find(
      (item) => item.class.class_id.toString() === classId
    );

    console.log("selected: ", selected);

    if (selected) {
      selected.semesters.forEach((sem) => {
        const opt = document.createElement("option");
        opt.value = sem.semester_id;
        opt.textContent = `Học kỳ ${sem.semester_number}`;
        semesterSelect.appendChild(opt);
      });

      // Set giá trị mặc định học kỳ đang chọn
      semesterSelect.value = semesterId;
    }
  });

/**
 * Gửi yêu cầu cập nhật thông tin lớp học phần đến backend.
 *
 * @param {Object} payload - Dữ liệu cập nhật lớp học phần.
 * @param {string} payload.classSubjectID - ID lớp học phần.
 * @param {string} payload.semesterID - ID học kỳ.
 * @param {string} payload.classStatus - Trạng thái lớp (active/inactive...).
 * @param {string} payload.teacherCode - Mã giảng viên phụ trách.
 */
async function updateClass(payload) {
  if (!payload) {
    Swal.fire("Lỗi", "Thiếu thông tin để cập nhật!", "error");
    return;
  }
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/updateClass`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.status === "success") {
      getModuleList();
      Swal.fire("Thành công", "Thông tin đã được cập nhật!", "success");
    } else {
      Swal.fire(
        "Lỗi",
        data.message || "Không thể cập nhật thông tin!",
        "error"
      );
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật!", "error");
  }
}

/**
 * Xử lý khi người dùng nhấn nút "Lưu" trên form chỉnh sửa lớp học phần.
 * - Lấy dữ liệu từ form
 * - Đóng modal
 * - Gửi yêu cầu cập nhật qua `updateClass()`
 *
 * @param {Event} e - Sự kiện submit của form
 */
document
  .getElementById("editClassForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn reload trang
    const moduleID = document.getElementById("editModule").value;
    const semesterID = document.getElementById("editSemester").value;
    const classStatus = document.getElementById("editStatus").value;
    const teacherCode = document.getElementById("editTeacher").value;
    const classID = document.getElementById("editClassName").value;
    const payload = {
      classSubjectID,
      semesterID,
      classStatus,
      teacherCode,
    };

    bootstrap.Modal.getInstance(
      document.getElementById("editClassModal")
    ).hide();

    updateClass(payload);
  });
