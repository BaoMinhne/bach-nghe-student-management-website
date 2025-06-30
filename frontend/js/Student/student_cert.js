/**
 * Khởi chạy khi DOM đã tải xong.
 * Gọi hàm lấy chứng chỉ và hiển thị tên sinh viên.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await getCertificatesOfStudent();
  await displayStudentName();
});

/**
 * Hiển thị tên sinh viên hiện tại đang đăng nhập.
 * Dựa vào thông tin người dùng được lưu trong localStorage.
 */
async function displayStudentName() {
  const student = Storage.getUser();
  if (!student || !student.username) {
    Swal.fire("Lỗi", "Không xác định được sinh viên!", "error");
    return;
  }

  try {
    const API_BASE = "http://localhost:3000";
    const res = await fetch(
      `${API_BASE}/api/v1/student/getStudentInfo?studentCode=${student.username}`
    );

    const result = await res.json();

    if (result.status === "success") {
      document.querySelector(
        ".studentFullName"
      ).textContent = `${result.data.student_middle_name} ${result.data.student_name}`;
    } else {
      Swal.fire("Thông báo", "Không tìm thấy thông tin sinh viên!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Không thể kết nối tới máy chủ!", "error");
  }
}

/**
 * Gửi yêu cầu lấy danh sách chứng chỉ của sinh viên hiện tại.
 * Nếu thành công thì hiển thị danh sách chứng chỉ kèm phân trang.
 */
async function getCertificatesOfStudent() {
  const student = Storage.getUser();
  if (!student || !student.username) {
    Swal.fire("Lỗi", "Không xác định được sinh viên!", "error");
    return;
  }

  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/student/getCertificatesOfStudent?studentCode=${student.username}`
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
const limitRows = 8;
/** @type {number} */
let currentPage = 1;
/** @type {Array<Object>} */
let studentDatas = []; // Dữ liệu gốc
/** @type {Array<Object>} */
let filterDatas = []; // Dữ liệu sau khi lọc hoặc tìm kiếm

/**
 * Hiển thị bảng chứng chỉ theo từng trang.
 * @param {number} page - Trang hiện tại cần hiển thị.
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

  if (items.length > 0) {
    items.forEach((student, index) => {
      let date = student.ngay_cap;
      formatDate = date ? dayjs(date).format("DD/MM/YYYY") : "-";
      const row = document.createElement("tr");
      row.innerHTML = `
			  <td>${index + start + 1}</td>
			<td>${student.so_hieu}</td>
			<td>${student.ma_so}</td>
			<td>${student.ten}</td>
			<td>${student.lop}</td>
			<td>${student.ten_mon}</td>
			<td>${formatDate}</td>
		`;
      studentList.appendChild(row);
    });
  } else {
    studentList.innerHTML = `
		<tr>
			<td colspan="7" class="text-center text-muted bg-body-secondary">Chưa Có Chứng Chỉ Được Cấp</td>
		</tr>
	`;
  }
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
