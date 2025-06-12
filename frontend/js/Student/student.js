document.addEventListener("DOMContentLoaded", function () {
  fetchStudentScores();
  displayStudentName();
});

async function fetchStudentScores() {
  const student = Storage.getUser();
  if (!student || !student.username) {
    Swal.fire("Lỗi", "Không xác định được sinh viên!", "error");
    return;
  }

  try {
    const API_BASE = "http://localhost:3000";
    const res = await fetch(
      `${API_BASE}/api/v1/student/getScore?studentCode=${student.username}`
    );
    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      console.log("data: " + result.data);
      renderScoresToTable(result.data);
      summaryCard(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu điểm!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu điểm!", "error");
  }
}

function renderScoresToTable(scores) {
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";
  console.log(scores);

  scores.forEach((item, index) => {
    var KQ;
    if (item["Tổng điểm"] === null || item["Tổng điểm"] === undefined) {
      KQ = "-";
    } else if (item["Tổng điểm"] >= 4) {
      KQ = "Đạt";
    } else {
      KQ = "Không Đạt";
    }
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item["Mã Môn học"]}</td>
      <td>${item["Tên Môn học"]}</td>
      <td>${item["Đơn Vị Học"] ?? "-"}</td>
      <td>${item["Học kỳ"] ?? "-"}</td>
      <td>${item["Tổng điểm"] ?? "-"}</td>
      <td>${KQ}</td>
      <td>-</td>
    `;

    tbody.appendChild(row);
  });
}

function summaryCard(scores) {
  const avg10Score = document.querySelector(".card.yellow .h3");
  const avg4Score = document.querySelector(".card.red .h3");
  const result = document.querySelector(".card.blue .h3");
  const letterGrade = document.querySelector(".card.teal .h3");

  const validScores = scores
    .map((s) => parseFloat(s["Tổng điểm"]))
    .filter((score) => !isNaN(score));
  console.log("Điểm hợp lệ:", validScores);

  if (validScores.length !== scores.length || validScores.length === 0) {
    avg10Score.textContent = "-";
    avg4Score.textContent = "-";
    result.textContent = "-";
    letterGrade.textContent = "-";
    return;
  }

  const sum = validScores.reduce((a, b) => a + b, 0);
  const avg10 = sum / validScores.length;
  console.log("Tổng điểm:", sum);
  console.log("Điểm trung bình 10:", avg10);

  const avg4 =
    validScores
      .map((score) => convertToHeSo4(score))
      .reduce((a, b) => a + b, 0) / validScores.length;

  const passed = validScores.every((score) => score >= 4);
  const letter = convertToLetterGrade(avg10);

  avg10Score.textContent = avg10.toFixed(2);
  avg4Score.textContent = avg4.toFixed(2);
  result.textContent = passed ? "Đạt" : "Không đạt";
  letterGrade.textContent = letter;
}

function convertToHeSo4(score) {
  if (score >= 9) return 4.0;
  if (score >= 7.0) return 3.0;
  if (score >= 5.5) return 2.0;
  if (score >= 4.0) return 1.0;
  return 0.0;
}

function convertToLetterGrade(score) {
  if (score >= 8.5) return "A";
  if (score >= 8.0) return "B+";
  if (score >= 7.0) return "B";
  if (score >= 6.5) return "C+";
  if (score >= 5.5) return "C";
  if (score >= 5.0) return "D+";
  if (score >= 4.0) return "D";
  return "F";
}

async function filterStudentScores() {
  const student = Storage.getUser();
  if (!student || !student.username) {
    Swal.fire("Lỗi", "Không xác định được sinh viên!", "error");
    return;
  }

  const semesterInput = document.querySelector("#hocKy");
  const semester = semesterInput.value.trim();

  try {
    const API_BASE = "http://localhost:3000";
    const res = await fetch(
      `${API_BASE}/api/v1/student/getScoreBySemester?studentCode=${student.username}&semester=${semester}`
    );
    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      console.log("Dữ liệu sau khi lọc:", result.data);
      renderScoresToTable(result.data);
      summaryCard(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu điểm!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu điểm!", "error");
  }
}

async function displayStudentName() {
  const student = Storage.getUser();
  if (!student || !student.username) {
    Swal.fire("Lỗi", "Không xác định được sinh viên!", "error");
    return;
  }

  try {
    const API_BASE = "http://localhost:3000";
    const res = await fetch(
      `${API_BASE}/api/v1/student/getStudentInfo?studentCode=${student.username}`
    );

    const result = await res.json();

    if (result.status === "success") {
      document.querySelector(
        ".studentFullName"
      ).textContent = `${result.data.student_middle_name} ${result.data.student_name}`;
    } else {
      Swal.fire("Thông báo", "Không tìm thấy thông tin sinh viên!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Không thể kết nối tới máy chủ!", "error");
  }
}
