document.addEventListener("DOMContentLoaded", async () => {
  await loadListByRole();
});

document.getElementById("role").addEventListener("change", async () => {
  currentPage = 1;
  await loadListByRole();
});

function generateRandomPassword(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}

// === Biến toàn cục ===
/** @type {number} */
const limitRows = 5;
/** @type {number} */
let currentPage = 1;
/** @type {Array<Object>} */
let filterDatas = [];
let currentRole = "1";

async function loadListByRole() {
  const roleValue = document.getElementById("role").value;
  currentRole = roleValue;

  if (roleValue === "2") {
    // Giảng viên
    await getListTeacherCode();
  } else {
    // Sinh viên
    await getListStudentCode();
  }
}

async function getListStudentCode() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getListStudentCode`);

    const result = await res.json();

    if (result.status === "success" && result.data) {
      filterDatas = [...result.data];
      renderStudentList(filterDatas);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

async function getListTeacherCode() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getListTeacherCode`);

    const result = await res.json();

    if (result.status === "success" && result.data) {
      filterDatas = [...result.data];
      renderTeacherList(filterDatas);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

/**
 * Gán dữ liệu và hiển thị danh sách học viên trên giao diện kèm phân trang.
 * @param {Array<Object>} students - Mảng dữ liệu học viên từ server
 */
function renderStudentList(students) {
  filterDatas = students;
  displayStudentListPage(currentPage);
  renderPagination();
}

/**
 * Hiển thị học viên cho một trang cụ thể.
 * @param {number} page - Số trang cần hiển thị
 */
function displayStudentListPage(page) {
  const studentList = document.getElementById("form-list");
  studentList.innerHTML = ""; // Clear existing rows
  const start = (page - 1) * limitRows;
  const end = start + limitRows;
  const items = filterDatas.slice(start, end);

  items.forEach((student) => {
    const newPassword = generateRandomPassword(8);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <input class="form-check-input checkbox-input" type="checkbox" />
	  </td>
      <td><span>${student.student_code}</span></td>
      <td><span>${student.student_middle_name}
	  ${student.student_name}</span></td>
      <td>
			<input
			type="password"
			class="form-control password-input"
			name="password"
			required
			value="${newPassword}"
			/>
		</td>
	`;
    studentList.appendChild(row);
  });
}

function renderTeacherList(teacher) {
  filterDatas = teacher;
  displayTeacherListPage(currentPage);
  renderPagination();
}

function displayTeacherListPage(page) {
  const teacherList = document.getElementById("form-list");
  teacherList.innerHTML = ""; // Clear existing rows
  const start = (page - 1) * limitRows;
  const end = start + limitRows;
  const items = filterDatas.slice(start, end);

  items.forEach((teacher) => {
    const newPassword = generateRandomPassword(8);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <input class="form-check-input checkbox-input" type="checkbox"/>
	  </td>
      <td><span>${teacher.teacher_code}</span></td>
      <td><span>${teacher.teacher_name}</span></td>
      <td>
			<input
			type="password"
			class="form-control password-input"
			name="password"
			value="${newPassword}"
			/>
		</td>
	`;
    teacherList.appendChild(row);
  });
}

/**
 * Vẽ thanh phân trang phía dưới bảng.
 * Tự động thêm các nút trang, dấu "..." và nút chuyển trang trước/sau.
 */
function renderPagination() {
  const totalPages = Math.ceil(filterDatas.length / limitRows);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const maxVisible = 3; // Số nút trang muốn hiển thị xung quanh trang hiện tại
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  // Điều chỉnh nếu cuối danh sách
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  // Nút "«" ← previous
  if (currentPage > 1) {
    pagination.appendChild(createPageItem("«", currentPage - 1));
  }

  // Nút trang đầu + dấu ...
  if (startPage > 1) {
    pagination.appendChild(createPageItem(1, 1));
    if (startPage > 2) {
      pagination.appendChild(createEllipsis());
    }
  }

  // Các nút trang chính giữa
  for (let i = startPage; i <= endPage; i++) {
    const li = createPageItem(i, i);
    if (i === currentPage) li.classList.add("active");
    pagination.appendChild(li);
  }

  // Dấu ... + trang cuối
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pagination.appendChild(createEllipsis());
    }
    pagination.appendChild(createPageItem(totalPages, totalPages));
  }

  // Nút "»" → next
  if (currentPage < totalPages) {
    pagination.appendChild(createPageItem("»", currentPage + 1));
  }
}

/**
 * Tạo một nút trang (số hoặc điều hướng).
 * @param {string|number} label - Nội dung hiển thị của nút
 * @param {number} pageNum - Số trang tương ứng khi click
 * @returns {HTMLLIElement} - Phần tử <li> chứa nút
 */
function createPageItem(label, pageNum) {
  const li = document.createElement("li");
  li.className = "page-item";
  const a = document.createElement("a");
  a.className = "page-link";
  a.href = "#";
  a.textContent = label;
  a.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = pageNum;
    if (currentRole === "2") {
      displayTeacherListPage(currentPage);
    } else {
      displayStudentListPage(currentPage);
    }

    renderPagination();
  });
  li.appendChild(a);
  return li;
}

/**
 * Tạo một phần tử phân trang dạng "..." (dấu ba chấm).
 * @returns {HTMLLIElement} - Phần tử <li> disabled
 */
function createEllipsis() {
  const li = document.createElement("li");
  li.className = "page-item disabled";
  li.innerHTML = `<span class="page-link">...</span>`;
  return li;
}
