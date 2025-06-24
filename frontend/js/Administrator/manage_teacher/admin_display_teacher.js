document.addEventListener("DOMContentLoaded", async () => {
  getTeacherList();
});

/**
 * Chuyển đổi các giá trị kỹ thuật thành dạng dễ đọc cho người dùng.
 * @param {*} value - Giá trị cần chuyển đổi (string, null, undefined)
 * @returns {string} - Giá trị đã chuyển đổi phù hợp để hiển thị
 */

function transferValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  } else if (value === "female") {
    return "Nữ";
  } else if (value === "male") {
    return "Nam";
  } else if (value === "other") {
    return "Khác";
  } else if (value === "on_leave") {
    return "Nghỉ phép";
  } else if (value === "resigned") {
    return "Nghỉ việc";
  } else if (value === "retired") {
    return "Nghỉ hưu";
  } else {
    return value;
  }
}

/**
 * Gửi request đến API backend để lấy danh sách học viên.
 * Nếu thành công sẽ gọi hàm hiển thị dữ liệu và phân trang.
 */
async function getTeacherList() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getTeacherList`);
    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      console.log("Teacher List:", result.data);
      teacherDatas = result.data;
      filterDatas = [...teacherDatas];
      renderTeacherList(filterDatas);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
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
let teacherDatas = []; // Dữ liệu gốc
/** @type {Array<Object>} */
let filterDatas = []; // Dữ liệu sẽ hiển thị khi tìm kiếm

/**
 * Gán dữ liệu và hiển thị danh sách học viên trên giao diện kèm phân trang.
 * @param {Array<Object>} teachers - Mảng dữ liệu học viên từ server
 */
function renderTeacherList(teachers) {
  filterDatas = teachers;
  displayTeacherListPage(currentPage);
  renderPagination();
}

/**
 * Hiển thị học viên cho một trang cụ thể.
 * @param {number} page - Số trang cần hiển thị
 */
function displayTeacherListPage(page) {
  const teacherList = document.getElementById("teacherTableBody");
  teacherList.innerHTML = ""; // Clear existing rows
  const start = (page - 1) * limitRows;
  const end = start + limitRows;
  const items = filterDatas.slice(start, end);

  items.forEach((teacher, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span>${start + index + 1}</span></td>
      <td><span>${teacher.teacher_code}</span></td>
	  <td><span>${teacher.teacher_name} </span></td>
      <td><span>${transferValue(teacher.teacher_date_of_birth)}</span></td>
      <td><span>${transferValue(teacher.teacher_gender)}</span></td>
      <td class="marquee-hover"><span>${transferValue(
        teacher.teacher_address
      )}</span></td>
      <td class="marquee-hover"><span>${transferValue(
        teacher.teacher_email
      )}</span></td>
      <td class="marquee-hover"><span>${transferValue(
        teacher.teacher_phone
      )}</span></td>
      <td><span>${transferValue(teacher.teacher_status)}</span></td>
      <td>
        <button
                class="btn btn-sm btn-warning me-1"
                data-bs-toggle="modal"
                data-bs-target="#editTeacherModal"
				data-code = "${teacher["teacher_code"]}"
				data-name = "${teacher["teacher_name"]}"
				data-phone = "${teacher["teacher_phone"]}"
				data-gender = "${teacher["teacher_gender"]}"
				data-date-of-birth = "${teacher["teacher_date_of_birth"]}"
				data-email = "${teacher["teacher_email"]}"
				data-address = "${teacher["teacher_address"]}"
				data-status = "${teacher["teacher_status"]}">
				
                <i class="bi bi-pencil-square"></i> Sửa
              </button>
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
 * Lắng nghe input ô tìm kiếm và lọc dữ liệu từ `studentDatas` gốc.
 * Hiển thị danh sách học viên phù hợp.
 */
document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.trim().toLowerCase();

  // filter dữ liệu từ danh sách sinh viên gốc
  const filtered = teacherDatas.filter((teacher) => {
    const fullName = `${teacher.teacher_name}`.toLowerCase();
    return (
      teacher.teacher_code.toLowerCase().includes(keyword) ||
      fullName.includes(keyword) ||
      teacher.teacher_phone?.toLowerCase().includes(keyword)
    );
  });

  currentPage = 1;
  renderTeacherList(filtered);
});
