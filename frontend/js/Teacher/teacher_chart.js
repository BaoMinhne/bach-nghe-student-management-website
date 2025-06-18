document.addEventListener("DOMContentLoaded", function () {
  getStudentPassing();
  getPassingPropotion();
  getAvgScore();
  getScoreProgress();
  getCountTeaching();
  getLastUpdate();
});

async function getStudentPassing() {
  const teacher = Storage.getUser();
  if (!teacher || !teacher.username) {
    Swal.fire("Lỗi", "Không xác định được giảng viên!", "error");
    return;
  }

  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/teacher/getStudentPassing?teacherCode=${teacher.username}`
    );
    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      console.log("Student Passing Data:", result.data);
      renderStudentPassingChart(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

async function getPassingPropotion() {
  const teacher = Storage.getUser();
  if (!teacher || !teacher.username) {
    Swal.fire("Lỗi", "Không xác định được giảng viên!", "error");
    return;
  }

  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/teacher/getPassingPropotion?teacherCode=${teacher.username}`
    );
    const result = await res.json();

    if (result.status === "success" && result.data) {
      console.log("Passing Proportion Data:", result.data);
      renderPieChart(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu tổng thể!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

async function getAvgScore() {
  const teacher = Storage.getUser();
  if (!teacher || !teacher.username) {
    Swal.fire("Lỗi", "Không xác định được giảng viên!", "error");
    return;
  }

  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/teacher/getAvgScore?teacherCode=${teacher.username}`
    );
    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      console.log("Average Score Data:", result.data);
      renderAvgScoreChart(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được điểm trung bình!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

async function getScoreProgress() {
  const teacher = Storage.getUser();
  if (!teacher || !teacher.username) {
    Swal.fire("Lỗi", "Không xác định được giảng viên!", "error");
    return;
  }
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/teacher/getScoreProgress?teacherCode=${teacher.username}`
    );
    const result = await res.json();
    console.log("Score Progress Result:", result);

    if (result.status === "success") {
      console.log("Score Progress Data:", result.data);
      renderScoreProgress(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được tiến độ điểm!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu tiến độ điểm!", "error");
  }
}

function renderScoreProgress(datas) {
  const score = document.querySelector(".score_progress");

  if (datas.length === 0) {
    score.textContent = "Không có dữ liệu tiến độ điểm!!";
    return;
  }

  const totalClasses = datas.tong_sinh_vien;
  const enteredScores = datas.so_diem_da_nhap;
  const progressPercentage = ((enteredScores / totalClasses) * 100).toFixed(2);

  score.textContent = progressPercentage + "%";
}

async function getCountTeaching() {
  const teacher = Storage.getUser();
  if (!teacher || !teacher.username) {
    Swal.fire("Lỗi", "Không xác định được giảng viên!", "error");
    return;
  }
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/teacher/getCountTeaching?teacherCode=${teacher.username}`
    );
    const result = await res.json();
    console.log("Count Teaching Result:", result);
    if (result.status === "success" && result.data) {
      console.log("Count Teaching Data:", result.data);
      renderCountTeaching(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được số lượng lớp dạy!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu số lượng lớp dạy!", "error");
  }
}

function renderCountTeaching(data) {
  const countElement = document.querySelector(".count_teaching");
  if (data) {
    countElement.textContent = data;
  } else {
    countElement.textContent = "Không có dữ liệu!";
  }
  console.log("Count Teaching Data:", data);
}

async function getLastUpdate() {
  const teacher = Storage.getUser();
  if (!teacher || !teacher.username) {
    Swal.fire("Lỗi", "Không xác định được giảng viên!", "error");
    return;
  }
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/teacher/getLastUpdate?teacherCode=${teacher.username}`
    );
    const result = await res.json();

    if (result.status === "success" && result.data) {
      console.log("Last Update Data:", result.data);
      renderLastUpdate(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được lần cuối cập nhật!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu lần cuối cập nhật!", "error");
  }
}

function renderLastUpdate(data) {
  const lastUpdateElement = document.querySelector(".last_update");
  if (data) {
    lastUpdateElement.textContent = ` ${data}`;
  } else {
    lastUpdateElement.textContent = "Không có dữ liệu cập nhật!";
  }
}

function renderStudentPassingChart(datas) {
  const ctx = document.getElementById("studentPassingChart").getContext("2d");
  const labels = datas.map((item) => `${item.subject}`);
  const totals = datas.map((item) => item.total_students);
  const passed = datas.map((item) => item.passed_students);
  console.log("Labels:", labels);
  console.log("Total Students:", totals);
  console.log("Passed Students:", passed);
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Tổng học viên",
          data: totals,
          backgroundColor: "#42A5F5",
        },
        {
          label: "Học viên đạt",
          data: passed,
          backgroundColor: "#66BB6A",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function renderPieChart(data) {
  const ctx = document.getElementById("pieChart").getContext("2d");

  const passedCount = data.passed_students;
  const notPassedCount = data.total_students - data.passed_students;

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Đạt (≥ 4.0)", "Không đạt (< 4.0)"],
      datasets: [
        {
          data: [passedCount, notPassedCount],
          backgroundColor: ["#4CAF50", "#FF6F61"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

function renderAvgScoreChart(datas) {
  const ctx = document.getElementById("avgScoreChart").getContext("2d");

  const labels = datas.map((item) => `${item.class} - ${item.subject}`);
  const scores = datas.map((item) => item.average_score);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Điểm trung bình",
          data: scores,
          borderColor: "#FFA726",
          backgroundColor: "rgba(255, 167, 38, 0.6)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y", // ✅ vẽ ngang
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.raw.toFixed(2)} điểm`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 10,
          title: {
            display: true,
            text: "Thang điểm 10",
          },
        },
        y: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
          },
        },
      },
    },
  });
}
