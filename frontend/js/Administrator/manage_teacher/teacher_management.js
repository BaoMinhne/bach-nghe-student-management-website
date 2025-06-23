document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("teacherForm");
  const tableBody = document.getElementById("teacherTableBody");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const hoTen = document.getElementById("hoTen").value.trim();
    const chuyenMon = document.getElementById("chuyenMon").value.trim();
    const sdt = document.getElementById("sdt").value.trim();
    const email = document.getElementById("email").value.trim();
    const diaChi = document.getElementById("diaChi").value.trim();

    const rowCount = tableBody.querySelectorAll("tr").length;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${rowCount + 1}</td>
      <td>${hoTen}</td>
      <td>${chuyenMon}</td>
      <td>${sdt}</td>
      <td>${email}</td>
      <td>${diaChi}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1"><i class="bi bi-pencil-square"></i> Sửa</button>
        <button class="btn btn-sm btn-danger"><i class="bi bi-trash"></i> Xóa</button>
      </td>
    `;

    tableBody.appendChild(newRow);
    form.reset();

    const modalElement = document.getElementById("addTeacherModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  });
});
