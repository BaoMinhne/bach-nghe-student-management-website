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

  const saveButtons = document.querySelectorAll('#studentTable button');
  saveButtons.forEach(button => {
    button.addEventListener('click', () => {
      const row = button.closest('tr');
      const name = row.cells[1].textContent;
      const score = row.querySelector('input').value;
      alert(`Đã lưu điểm ${score} cho ${name}`);
    });
  });
});
