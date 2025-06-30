/**
 * Khi trang được load hoàn tất, thực hiện gọi các API thống kê.
 */
document.addEventListener("DOMContentLoaded", function () {
  getCountStudentInClass();
  getModuleCertificateStats();
});

/**
 * Gửi yêu cầu đến API để lấy số lượng sinh viên theo từng lớp học.
 * Nếu thành công, hiển thị biểu đồ cột bằng Chart.js.
 */
async function getCountStudentInClass() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getCountStudentInClass`);
    const result = await res.json();

    if (result.status === "success") {
      const countDatas = result.data;
      console.log("Dữ liệu lớp:", countDatas);
      renderCountStudentInClass(countDatas);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

/**
 * Gửi yêu cầu đến API để lấy thống kê số sinh viên đã và chưa đạt chứng chỉ theo môn học.
 * Nếu thành công, hiển thị hai biểu đồ: biểu đồ tròn và biểu đồ cột.
 */
async function getModuleCertificateStats() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/admin/getModuleCertificateStats`
    );
    const result = await res.json();

    if (result.status === "success") {
      const stats = result.data;
      console.log("Dữ liệu lớp:", stats);

      // Tiếp tục render biểu đồ
      renderModuleChart(stats);
      renderPieChart(stats);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

/**
 * Hiển thị biểu đồ tròn tỷ lệ sinh viên đã được cấp chứng chỉ.
 *
 * @param {Array<Object>} data - Danh sách thống kê theo từng module.
 * @param {number} data[].certified_students - Số sinh viên đã có chứng chỉ.
 * @param {number} data[].total_students - Tổng số sinh viên của module.
 */
function renderPieChart(data) {
  const certifiedTotal = data.reduce(
    (sum, item) => sum + item.certified_students,
    0
  );
  const total = data.reduce((sum, item) => sum + item.total_students, 0);
  const uncertifiedTotal = total - certifiedTotal;

  const ctx = document.getElementById("certPieChart").getContext("2d");

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Đã cấp chứng chỉ", "Chưa cấp chứng chỉ"],
      datasets: [
        {
          data: [certifiedTotal, uncertifiedTotal],
          backgroundColor: ["#10B981", "#F87171"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: "Tỷ lệ sinh viên đạt chứng chỉ",
        },
      },
    },
  });
}

/**
 * Hiển thị biểu đồ cột so sánh tổng sinh viên và số sinh viên đã đạt chứng chỉ theo từng môn học.
 *
 * @param {Array<Object>} data - Danh sách thống kê theo từng module.
 * @param {string} data[].module_name - Tên môn học.
 * @param {number} data[].total_students - Tổng số sinh viên.
 * @param {number} data[].certified_students - Số sinh viên có chứng chỉ.
 */
function renderModuleChart(data) {
  const labels = data.map((item) => item.module_name);
  const totalStudents = data.map((item) => item.total_students);
  const certifiedStudents = data.map((item) => item.certified_students);

  const ctx = document.getElementById("moduleChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Tổng số sinh viên",
          data: totalStudents,
          backgroundColor: "#3B82F6",
          borderRadius: 6,
        },
        {
          label: "Đã cấp chứng chỉ",
          data: certifiedStudents,
          backgroundColor: "#10B981",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 10, // 🔽 Nhỏ hơn mặc định (~14)
            },
          },
        },
        title: {
          display: true,
          text: "Số sinh viên đạt theo lớp - môn",
          font: {
            size: 12, // 🔽 Nhỏ hơn
          },
        },
        tooltip: {
          bodyFont: {
            size: 12,
          },
          titleFont: {
            size: 13,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 10,
            },
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 10,
            },
          },
        },
      },
    },
  });
}

/**
 * Hiển thị biểu đồ cột thể hiện số sinh viên theo từng lớp học.
 *
 * @param {Array<Object>} data - Dữ liệu số lượng sinh viên theo lớp.
 * @param {string} data[].class_name - Tên lớp.
 * @param {number} data[].student_count - Số sinh viên trong lớp.
 */
function renderCountStudentInClass(data) {
  const labels = data.map((item) => item.class_name);
  const values = data.map((item) => item.student_count);

  const ctx = document.getElementById("classChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Số sinh viên",
          data: values,
          backgroundColor: "#3B82F6",
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Số lượng sinh viên",
          },
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 0,
          },
        },
      },
    },
  });
}
