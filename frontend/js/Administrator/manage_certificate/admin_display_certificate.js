const urlParams = new URLSearchParams(window.location.search);
let class_subject_id = urlParams.get("class_subject"); // có thể gán trực tiếp

let className = urlParams.get("class_name");
let moduleName = urlParams.get("module_name");

/**
 * Khi DOM đã tải xong, thực hiện:
 * - Lấy dữ liệu chứng chỉ từ API (`getCertificates`)
 * - Hiển thị tên môn học và lớp học trên giao diện.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await getCertificates();
  renderModuleName();
});

/**
 * Hiển thị tên môn học và tên lớp học lên giao diện.
 * Lấy dữ liệu từ URL query params: `module_name`, `class_name`.
 */
function renderModuleName() {
  document.querySelector(".module_name").textContent = moduleName;
  document.querySelector(".class_name").textContent = className;
}

/**
 * Gửi yêu cầu API để lấy danh sách học viên đã được cấp chứng chỉ cho lớp học phần hiện tại.
 * Dữ liệu được lấy theo `class_subject_id` trong URL.
 * Gán dữ liệu vào biến toàn cục `studentDatas` và `filterDatas`, rồi hiển thị ra bảng.
 */
async function getCertificates() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/admin/getCertificates?class_subject_id=${class_subject_id}`
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
let filterDatas = []; // Dữ liệu sẽ hiển thị khi tìm kiếm

/**
 * Gán dữ liệu danh sách học viên và hiển thị bảng danh sách theo trang.
 *
 * @param {Array<Object>} students - Mảng đối tượng học viên (có thông tin chứng chỉ).
 */
function renderStudentList(students) {
  filterDatas = students;
  displayStudentListPage(currentPage);
  renderPagination();
}

/**
 * Hiển thị bảng danh sách học viên cho một trang cụ thể.
 *
 * @param {number} page - Trang cần hiển thị (bắt đầu từ 1).
 */
function displayStudentListPage(page) {
  const studentList = document.getElementById("form-list");
  studentList.innerHTML = ""; // Clear existing rows
  const start = (page - 1) * limitRows;
  const end = start + limitRows;
  const items = filterDatas.slice(start, end);

  items.forEach((student, index) => {
    let day = student.issued_date;
    let idCard = student.student_IDCard || "Chưa có thông tin";
    let address = student.student_address || "Chưa có thông tin";
    formatDate = day ? dayjs(day).format("DD/MM/YYYY") : "-";
    const row = document.createElement("tr");
    row.innerHTML = `
      	<td>${index + start + 1}</td>
		<td>${student.student_code}</td>
		<td>${student.student_middle_name} ${student.student_name}</td>
		<td class="${idCard === "Chưa có thông tin" ? "text-danger" : ""}">
			${idCard}
		</td>
		<td class="${address === "Chưa có thông tin" ? "text-danger" : ""}">
			${address}
		</td>
		<td>${student.cert_number}</td>
		<td>${formatDate}</td>
		
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
 * Tạo một phần tử nút trang (có thể là số trang hoặc ký hiệu điều hướng).
 *
 * @param {string|number} label - Nội dung hiển thị của nút (ví dụ: 1, "«", "»").
 * @param {number} pageNum - Trang sẽ hiển thị khi người dùng click vào nút này.
 * @returns {HTMLLIElement} - Phần tử <li> chứa nút chuyển trang.
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
 * Tạo phần tử dấu ba chấm "..." dùng trong phân trang để biểu thị trang bị ẩn.
 *
 * @returns {HTMLLIElement} - Phần tử <li> disabled với nội dung "...".
 */
function createEllipsis() {
  const li = document.createElement("li");
  li.className = "page-item disabled";
  li.innerHTML = `<span class="page-link">...</span>`;
  return li;
}

/**
 * (Tạm thời bị comment)
 * Tìm kiếm học viên theo mã sinh viên, họ tên hoặc số điện thoại.
 * Lọc từ `studentDatas` gốc và hiển thị lại bảng theo kết quả lọc.
 */
// document.getElementById("searchInput").addEventListener("input", function () {
//   const keyword = this.value.trim().toLowerCase();

//   // filter dữ liệu từ danh sách sinh viên gốc
//   const filtered = studentDatas.filter((student) => {
//     const fullName =
//       `${student.student_middle_name} ${student.student_name}`.toLowerCase();
//     return (
//       student.student_code.toLowerCase().includes(keyword) ||
//       fullName.includes(keyword) ||
//       student.student_phone?.toLowerCase().includes(keyword)
//     );
//   });

//   currentPage = 1;
//   renderStudentList(filtered);
// });
