document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("classChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Lớp A", "Lớp B", "Lớp C", "Lớp D", "Lớp E"],
      datasets: [{
        label: "Số sinh viên",
        data: [30, 45, 25, 50, 40],
        backgroundColor: "#3B82F6",
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
