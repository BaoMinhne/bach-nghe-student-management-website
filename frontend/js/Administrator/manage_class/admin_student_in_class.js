/**
 * Khi trang được tải xong, gọi API để lấy danh sách học viên trong lớp
 * và hiển thị thông tin lớp học lên giao diện.
 */
document.addEventListener("DOMContentLoaded", async () => {
  getStudentInClass();
  displayClass();
});

/**
 * Lấy các tham số từ URL hiện tại để phục vụ việc truy xuất dữ liệu lớp học.
 *
 * @returns {{ class_subject_id: string|null, class_name: string|null, module_name: string|null }}
 * Các thông tin: mã lớp học phần, tên lớp, tên môn học.
 */
function getParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    class_subject_id: urlParams.get("class_subject_id"),
    class_name: urlParams.get("class_name"),
    module_name: urlParams.get("module_name"),
  };
}

/**
 * Hiển thị tên lớp và tên môn học lên giao diện dựa trên tham số từ URL.
 */
function displayClass() {
  const { class_name, module_name } = getParams();

  document.querySelector(".class_name").textContent = class_name;
  document.querySelector(".module_name").textContent = module_name;
}

/**
 * Gửi yêu cầu đến backend để lấy danh sách học viên đã thuộc lớp học phần.
 * Sau đó cập nhật giao diện và phân trang danh sách.
 */
async function getStudentInClass() {
  const API_BASE = "http://localhost:3000";
  const class_subject_id = getParams();
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/admin/getStudentInClass?class_subject_id=${class_subject_id.class_subject_id}`
    );
    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      console.log("Student List:", result.data);
      studentDatas = result.data;
      filterDatas = [...studentDatas];
      renderStudentList(filterDatas);
    } else {
      console.log("Chưa Có Dữ Liệu!!!");
      //   Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

// === Biến toàn cục ===
/** @type {number} */
const limitRows = 10;
/** @type {number} */
let currentPage = 1;
/** @type {Array<Object>} */
let studentDatas = []; // Dữ liệu học viên từ server
/** @type {Array<Object>} */
let filterDatas = []; // Dữ liệu học viên sau khi lọc tìm kiếm

/**
 * Gán dữ liệu và hiển thị danh sách học viên theo trang.
 *
 * @param {Array<Object>} students - Mảng dữ liệu học viên từ server.
 */
function renderStudentList(students) {
  filterDatas = students;
  displayStudentListPage(currentPage);
  renderPagination();
}

/**
 * Hiển thị danh sách học viên trong một trang cụ thể.
 *
 * @param {number} page - Số trang cần hiển thị.
 */
function displayStudentListPage(page) {
  const studentList = document.getElementById("form-list");
  studentList.innerHTML = ""; // Clear existing rows
  const start = (page - 1) * limitRows;
  const end = start + limitRows;
  const items = filterDatas.slice(start, end);

  items.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span>${start + index + 1}</span></td>
      <td><span>${student.student_code}</span></td>
      <td><span>${student.student_middle_name}
	  ${student.student_name}</span></td>
	`;
    studentList.appendChild(row);
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
    displayStudentListPage(currentPage);
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

/**
 * Lắng nghe sự kiện nhập liệu trong ô tìm kiếm và lọc danh sách học viên
 * theo mã sinh viên, họ tên hoặc số điện thoại.
 */
document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.trim().toLowerCase();

  // filter dữ liệu từ danh sách sinh viên gốc
  const filtered = studentDatas.filter((student) => {
    const fullName =
      `${student.student_middle_name} ${student.student_name}`.toLowerCase();
    return (
      student.student_code.toLowerCase().includes(keyword) ||
      fullName.includes(keyword) ||
      student.student_phone?.toLowerCase().includes(keyword)
    );
  });

  currentPage = 1;
  renderStudentList(filtered);
});
