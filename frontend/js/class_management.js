document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", handleEdit);
  });

  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", handleDelete);
  });

  document.getElementById("btnAddClass").addEventListener("click", function () {
    const maLop = document.getElementById("newMaLop").value.trim();
    const tenLop = document.getElementById("newTenLop").value.trim();
    const khoaHoc = document.getElementById("newKhoaHoc").value.trim();
    const cvht = document.getElementById("newCVHT").value.trim();

    if (!maLop || !tenLop || !khoaHoc || !cvht) {
      alert("Vui lòng điền đầy đủ thông tin lớp học.");
      return;
    }

    const table = document.querySelector("table tbody");
    const newRow = document.createElement("tr");
    const currentRows = table.querySelectorAll("tr").length;

    newRow.innerHTML = `
      <td>${currentRows + 1}</td>
      <td>${maLop}</td>
      <td>${tenLop}</td>
      <td>${khoaHoc}</td>
      <td>${cvht}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1 btn-edit"><i class="bi bi-pencil-square"></i> Sửa</button>
        <button class="btn btn-sm btn-danger btn-delete"><i class="bi bi-trash"></i> Xóa</button>
      </td>
    `;

    table.appendChild(newRow);
    document.getElementById("createClassForm").reset();
    bootstrap.Modal.getInstance(document.getElementById("createClassModal")).hide();

    newRow.querySelector(".btn-edit").addEventListener("click", handleEdit);
    newRow.querySelector(".btn-delete").addEventListener("click", handleDelete);
  });

  function handleEdit() {
    const row = this.closest("tr");
    const cells = row.querySelectorAll("td");

    document.getElementById("maLop").value = cells[1].textContent.trim();
    document.getElementById("tenLop").value = cells[2].textContent.trim();
    document.getElementById("khoaHoc").value = cells[3].textContent.trim();
    document.getElementById("cvht").value = cells[4].textContent.trim();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("editClassModal")).show();
  }

  function handleDelete() {
    if (confirm("Bạn có chắc chắn muốn xóa lớp học này?")) {
      this.closest("tr").remove();
    }
  }
});
