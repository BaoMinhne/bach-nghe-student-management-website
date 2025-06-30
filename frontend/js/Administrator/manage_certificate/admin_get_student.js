/**
 * Khi DOM được tải xong, gọi hàm `getStudentEligible` để lấy danh sách học viên đủ điều kiện cấp chứng chỉ.
 */
document.addEventListener("DOMContentLoaded", async () => {
  getStudentEligible();
});

/**
 * Gửi yêu cầu đến API để lấy danh sách học viên đủ điều kiện cấp chứng chỉ.
 * Nếu thành công,
 * gán dữ liệu vào biến toàn cục `studentDatas` và `filterDatas`,
 * sau đó hiển thị bằng `renderStudentList`.
 *
 * @returns {Promise<void>}
 */
async function getStudentEligible() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getStudentEligible`);
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

/** @type {number} */
const limitRows = 5; // Số dòng hiển thị mỗi trang

/** @type {number} */
let currentPage = 1; // Trang hiện tại

/** @type {Array<Object>} */
let studentDatas = []; // Danh sách học viên gốc từ API

/** @type {Array<Object>} */
let filterDatas = []; // Dữ liệu học viên sau khi lọc hoặc phân trang

/** @type {number} */
let class_subject_id = 0; // ID lớp học phần lấy từ từng dòng học viên

/**
 * Gán danh sách học viên và hiển thị dữ liệu cho trang hiện tại.
 *
 * @param {Array<Object>} students - Mảng đối tượng học viên từ API.
 */
function renderStudentList(students) {
  filterDatas = students;
  displayStudentListPage(currentPage);
  renderPagination();
}

/**
 * Hiển thị bảng học viên theo một trang cụ thể.
 * Gồm thông tin mã SV, tên, môn học, lớp, điểm, ngày cấp chứng chỉ và nút "Duyệt".
 *
 * @param {number} page - Số trang cần hiển thị.
 */
function displayStudentListPage(page) {
  const studentList = document.getElementById("form-list");
  studentList.innerHTML = ""; // Clear existing rows
  const start = (page - 1) * limitRows;
  const end = start + limitRows;
  const items = filterDatas.slice(start, end);

  if (items.length > 0) {
    items.forEach((student) => {
      let day = student.issued_date;
      class_subject_id = student.class_subject_id;
      formatDate = day ? dayjs(day).format("DD/MM/YYYY") : "-";
      const row = document.createElement("tr");
      row.innerHTML = `
				<td><input type="checkbox" class="checkbox-input" /></td>
			  <td>${student.student_code}</td>
			  <td>${student.student_middle_name} ${student.student_name}</td>
			  <td>${student.module_name}</td>
			  <td>${student.class_name}</td>
			  <td>${student.score}</td>
			  <td>${formatDate}</td>
			  <td>
				  <button
					  data-code="${student["student_code"]}"
					  data-class-subject="${student["class_subject_id"]}"
					  type="button" class="btn btn-primary btn-addCert"
				  >
				  <i class="bi bi-patch-check"></i> Duyệt Chứng Chỉ
				  </button>
			  </td>
		  `;
      studentList.appendChild(row);
    });
  } else {
    studentList.innerHTML = `
		<tr>
			<td colspan="8" class="text-center text-muted bg-body-secondary">Chưa có học sinh đủ điều kiện</td>
		</tr>
	`;
  }
}

/**
 * Vẽ thanh phân trang cho bảng học viên.
 * Bao gồm các nút điều hướng "«", "»", số trang, và dấu "..." nếu cần.
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
 * Tạo phần tử dấu ba chấm "..." trong thanh phân trang.
 * Dùng khi danh sách trang dài.
 *
 * @returns {HTMLLIElement} - Phần tử <li> đã disable, chỉ hiển thị "…"
 */
function createEllipsis() {
  const li = document.createElement("li");
  li.className = "page-item disabled";
  li.innerHTML = `<span class="page-link">...</span>`;
  return li;
}

/**
 * (Đã bị comment)
 * Lọc danh sách học viên theo ô tìm kiếm.
 * Lọc theo mã SV, tên đầy đủ hoặc số điện thoại (nếu có).
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
