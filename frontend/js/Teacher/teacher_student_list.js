document.addEventListener("DOMContentLoaded", function () {
  getStudentList();
});

function getParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    moduleCode: urlParams.get("module"),
    classCode: urlParams.get("class"),
    classSubjectId: urlParams.get("class_subject"),
    className: urlParams.get("class_name"),
    moduleName: urlParams.get("module_name"),
  };
}

function getStudentList() {
  const { moduleCode, classCode, classSubjectId, className, moduleName } =
    getParams();
  if (!moduleCode || !classCode) {
    Swal.fire("Lỗi", "Không xác định được thông tin lớp học!", "error");
    return;
  }

  const teacher = Storage.getUser();
  if (!teacher || !teacher.username) {
    Swal.fire("Lỗi", "Không xác định được giảng viên!", "error");
    return;
  }

  console.log("Module Code:", moduleCode);
  console.log("Class Code:", classCode);
  console.log("Class Subject ID:", classSubjectId);
  console.log("Teacher Username:", teacher.username);
  console.log("Class Name:", className);
  console.log("Module Name:", moduleName);

  fetchStudentList(
    teacher.username,
    moduleCode,
    classCode,
    className,
    moduleName
  );
}

async function fetchStudentList(
  teacherCode,
  moduleCode,
  classCode,
  className,
  moduleName
) {
  const class_name = document.querySelector(".class_name");
  const module_name = document.querySelector(".module_name");

  if (!className || !moduleName) {
    Swal.fire("Lỗi", "Không xác định được tên lớp học hoặc môn học!", "error");
    return;
  }

  class_name.textContent = className;
  module_name.textContent = moduleName;

  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/teacher/getStudentInClass?teacherCode=${teacherCode}&moduleCode=${moduleCode}&classCode=${classCode}`
    );

    const result = await res.json();
    console.log("API Response:", result);

    if (result.status === "success" && Array.isArray(result.data)) {
      renderStudentList(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu sinh viên!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu sinh viên!", "error");
  }
}

function renderStudentList(students) {
  const tbody = document.getElementById("studentTable");
  tbody.innerHTML = "";

  students.forEach((student, index) => {
    var score = 0;
    if (student["score"] === null || student["score"] === undefined) {
      score = "-";
    } else {
      score = student["score"];
    }
    const row = document.createElement("tr");
    row.innerHTML = `
	  		<td>${index + 1}</td>
            <td>${student["student_code"]}</td>
            <td>${student["student_middle_name"]}</td>
            <td>${student["student_name"]}</td>
            <td>${student["class_name"]}-1</td>
            <td>${score}</td>
            <td>
              <button
                class="btn btn-sm btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#editModal"
				data-student-code="${student["student_code"]}"
                data-name="${student["student_middle_name"]} ${
      student["student_name"]
    }"
                data-class="${student["class_name"]}"
                data-score="${score}"
              >
                <i class="bi bi-pencil-square"></i> Sửa
              </button>
            </td>
	`;
    tbody.appendChild(row);
  });
}

async function updateStudentScore(studentCode, score) {
  const { classSubjectId } = getParams();

  const API_BASE = "http://localhost:3000";
  console.log("Updating score for:", {
    classSubjectId,
    studentCode,
    score,
  });
  if (!classSubjectId || !studentCode || score === "") {
    Swal.fire("Lỗi", "Thiếu dữ liệu để cập nhật điểm!", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/v1/teacher/updateStudentScore`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classSubjectId,
        studentCode,
        score: parseFloat(score),
      }),
    });

    const data = await res.json();

    if (data.status === "success") {
      Swal.fire("Thành công", "Điểm đã được cập nhật!", "success");
      getStudentList();
    } else {
      Swal.fire("Lỗi", data.message || "Không thể cập nhật điểm!", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật điểm!", "error");
  }
}

let currentStudentCode = "";

const editModal = document.getElementById("editModal");
editModal.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;
  const name = button.getAttribute("data-name");
  const className = button.getAttribute("data-class");
  const score = button.getAttribute("data-score");
  const studentCode = button.getAttribute("data-student-code");
  currentStudentCode = studentCode;
  console.log("Current Student Code:", currentStudentCode);
  document.getElementById("studentName").value = name;
  document.getElementById("studentClass").value = className;
  document.getElementById("studentScore").value = score;
});

document
  .getElementById("editScoreForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn reload trang
    const score = document.getElementById("studentScore").value;
    updateStudentScore(currentStudentCode, score);
  });
