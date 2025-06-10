document.addEventListener('DOMContentLoaded', function () {
  const filter = document.getElementById('classFilter');
  const tableRows = document.querySelectorAll('#studentTable tr');

  filter.addEventListener('change', () => {
    const selectedClass = filter.value;
    tableRows.forEach(row => {
      const classCell = row.cells[2].textContent;
      row.style.display = (selectedClass === 'all' || classCell === selectedClass) ? '' : 'none';
    });
  });

});

    const editModal = document.getElementById('editModal');
    editModal.addEventListener('show.bs.modal', function (event) {
      const button = event.relatedTarget;
      const name = button.getAttribute('data-name');
      const className = button.getAttribute('data-class');
      const score = button.getAttribute('data-score');

      document.getElementById('studentName').value = name;
      document.getElementById('studentClass').value = className;
      document.getElementById('studentScore').value = score;
    });

    document.getElementById('editScoreForm').addEventListener('submit', function (e) {
      e.preventDefault();

      alert('Điểm đã được cập nhật!');
      const modal = bootstrap.Modal.getInstance(editModal);
      modal.hide();
    });