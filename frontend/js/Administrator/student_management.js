let selectedRow = null;
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

document.addEventListener('DOMContentLoaded', () => {
  // Xử lý nút Sửa
  document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', function () {
      selectedRow = this.closest('tr');
      const cells = selectedRow.children;

      document.getElementById('editMaSV').value = cells[1].textContent;
      document.getElementById('editMatKhau').value = cells[2].textContent;
      document.getElementById('editHoDem').value = cells[3].textContent;
      document.getElementById('editTen').value = cells[4].textContent;
      document.getElementById('editGioiTinh').value = cells[5].textContent;
      document.getElementById('editDVHT').value = cells[6].textContent;
      document.getElementById('editCVHT').value = cells[7].textContent;
      document.getElementById('editDiaChi').value = cells[8].textContent;
      document.getElementById('editSDT').value = cells[9].textContent;

      editModal.show();
    });
  });

  // Xử lý nút Lưu trong modal
  document.getElementById('btnSaveChanges').addEventListener('click', function () {
    if (selectedRow) {
      const cells = selectedRow.children;

      cells[1].textContent = document.getElementById('editMaSV').value;
      cells[2].textContent = document.getElementById('editMatKhau').value;
      cells[3].textContent = document.getElementById('editHoDem').value;
      cells[4].textContent = document.getElementById('editTen').value;
      cells[5].textContent = document.getElementById('editGioiTinh').value;
      cells[6].textContent = document.getElementById('editDVHT').value;
      cells[7].textContent = document.getElementById('editCVHT').value;
      cells[8].textContent = document.getElementById('editDiaChi').value;
      cells[9].textContent = document.getElementById('editSDT').value;

      editModal.hide();
    }
  });

  // Xử lý nút Xóa
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function () {
      const row = this.closest('tr');
      const hoTen = row.children[3].textContent + ' ' + row.children[4].textContent;
      if (confirm(`Bạn có chắc muốn xóa học viên "${hoTen}" không?`)) {
        row.remove();
      }
    });
  });
});
