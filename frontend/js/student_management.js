let selectedRow = null;
const editModal = new bootstrap.Modal(document.getElementById('editModal'));

document.addEventListener('DOMContentLoaded', () => {
  // Xử lý nút Sửa
  document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', function () {
      selectedRow = this.closest('tr');

      // Gán dữ liệu từ bảng vào form modal
      document.getElementById('editHoDem').value = selectedRow.children[1].textContent;
      document.getElementById('editTen').value = selectedRow.children[2].textContent;
      document.getElementById('editGioiTinh').value = selectedRow.children[3].textContent;
      document.getElementById('editDVHT').value = selectedRow.children[4].textContent;
      document.getElementById('editCVHT').value = selectedRow.children[5].textContent;
      document.getElementById('editDiaChi').value = selectedRow.children[6].textContent;
      document.getElementById('editSDT').value = selectedRow.children[7].textContent;

      editModal.show();
    });
  });

  // Xử lý nút Lưu trong modal
  document.getElementById('btnSaveChanges').addEventListener('click', function () {
    if (selectedRow) {
      selectedRow.children[1].textContent = document.getElementById('editHoDem').value;
      selectedRow.children[2].textContent = document.getElementById('editTen').value;
      selectedRow.children[3].textContent = document.getElementById('editGioiTinh').value;
      selectedRow.children[4].textContent = document.getElementById('editDVHT').value;
      selectedRow.children[5].textContent = document.getElementById('editCVHT').value;
      selectedRow.children[6].textContent = document.getElementById('editDiaChi').value;
      selectedRow.children[7].textContent = document.getElementById('editSDT').value;

      editModal.hide();
    }
  });

  // Xử lý nút Xóa
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function () {
      const row = this.closest('tr');
      const hoTen = row.children[1].textContent + ' ' + row.children[2].textContent;
      if (confirm(`Bạn có chắc muốn xóa học viên "${hoTen}" không?`)) {
        row.remove();
      }
    });
  });
});
