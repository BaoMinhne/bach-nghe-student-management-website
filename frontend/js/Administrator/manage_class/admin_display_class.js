document.addEventListener("DOMContentLoaded", async () => {
  getModuleList();
});

/**
 * Chuyển đổi các giá trị kỹ thuật thành dạng dễ đọc cho người dùng.
 * @param {*} value - Giá trị cần chuyển đổi (string, null, undefined)
 * @returns {string} - Giá trị đã chuyển đổi phù hợp để hiển thị
 */

function transferValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  } else if (value === "active") {
    return "Đang hoạt động";
  } else if (value === "inactive") {
    return "Dừng hoạt động";
  } else if (value === "completed") {
    return "Hoàn Thành";
  } else if (value === "draft") {
    return "Đang chuẩn bị";
  } else {
    return value;
  }
}

/**
 * Gửi request đến API backend để lấy danh sách học viên.
 * Nếu thành công sẽ gọi hàm hiển thị dữ liệu và phân trang.
 */
async function getModuleList() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getModuleList`);
    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      console.log("Module List:", result.data);
      moduleDatas = result.data;
      filterDatas = [...moduleDatas];
      renderModuleList(filterDatas);
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
const limitRows = 5;
/** @type {number} */
let currentPage = 1;
/** @type {Array<Object>} */
let moduleDatas = []; // Dữ liệu gốc
/** @type {Array<Object>} */
let filterDatas = []; // Dữ liệu sẽ hiển thị khi tìm kiếm

/**
 * Gán dữ liệu và hiển thị danh sách học viên trên giao diện kèm phân trang.
 * @param {Array<Object>} modules - Mảng dữ liệu học viên từ server
 */
function renderModuleList(modules) {
  filterDatas = modules;
  displayModuleListPage(currentPage);
  renderPagination();
}

/**
 * Hiển thị học viên cho một trang cụ thể.
 * @param {number} page - Số trang cần hiển thị
 */
function displayModuleListPage(page) {
  const moduleList = document.getElementById("module-list");
  moduleList.innerHTML = ""; // Clear existing rows
  const start = (page - 1) * limitRows;
  const end = start + limitRows;
  const items = filterDatas.slice(start, end);

  items.forEach((module, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><span>${start + index + 1}</span></td>
      <td><span>${module.class_name}</span></td>
	  <td>
		<a
			href="./page_add_student_to_class.html?class_subject_id=${
        module["class_subject_id"]
      }&class_name=${module["class_name"]}&module_name=${module["module_name"]}"
			class="text-decoration-none text-body detail_class"
		><span>${module.module_name} </span></a
	  ></td>
      <td><span>${module.semester_number}</span></td>
      <td><span>${transferValue(module.class_status)}</span></td>
      <td>
        <button
		 class="btn btn-sm btn-warning me-1 btn-edit"
		 data-bs-toggle="modal"
         data-bs-target="#editClassModal"
		    data-class-subject-id="${module["class_subject_id"]}"
		 	data-class-id="${module["class_id"]}"
			data-class-code="${module["class_code"]}"
			data-class-name="${module["class_name"]}"
			data-module-id="${module["module_id"]}"
			data-module-code="${module["module_code"]}"
			data-module-name="${module["module_name"]}"
			data-teacher-code="${module["teacher_code"]}"
			data-teacher-name="${module["teacher_name"]}"
			data-semester-id="${module["semester_id"]}"
			data-semester="${module["semester_number"]}"
			data-status="${module["class_status"]}">
			<i class="bi bi-pencil-square"></i> Sửa
		</button>
              <button
                data-bs-toggle="modal"
                data-bs-target="#viewClassModal"
                type="button"
                class="btn btn-primary"
				data-class-id="${module["class_id"]}"
				data-class-code="${module["class_code"]}"
				data-class-name="${module["class_name"]}"
				data-module-id="${module["module_id"]}"
				data-module-code="${module["module_code"]}"
				data-module-name="${module["module_name"]}"
				data-teacher-code="${module["teacher_code"]}"
				data-teacher-name="${module["teacher_name"]}"
				data-semester-id="${module["semester_id"]}"
				data-semester="${module["semester_number"]}"
				data-start="${module["semester_start_date"]}"
				data-end="${module["semester_end_date"]}"
                id="btnSaveClass"
              >
                <i class="bi bi-list-ul"></i>
              </button>
      </td>
    `;
    moduleList.appendChild(row);
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
    displayModuleListPage(currentPage);
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
// document.getElementById("searchInput").addEventListener("input", function () {
//   const keyword = this.value.trim().toLowerCase();

//   // filter dữ liệu từ danh sách sinh viên gốc
//   const filtered = teacherDatas.filter((teacher) => {
//     const fullName = `${teacher.teacher_name}`.toLowerCase();
//     return (
//       teacher.teacher_code.toLowerCase().includes(keyword) ||
//       fullName.includes(keyword) ||
//       teacher.teacher_phone?.toLowerCase().includes(keyword)
//     );
//   });

//   currentPage = 1;
//   renderTeacherList(filtered);
// });

document
  .getElementById("viewClassModal")
  .addEventListener("show.bs.modal", function (event) {
    const trigger = event.relatedTarget;

    const class_code = trigger.getAttribute("data-class-code") || "-";
    const class_name = trigger.getAttribute("data-class-name") || "-";
    const module_code = trigger.getAttribute("data-module-code") || "-";
    const module_name = trigger.getAttribute("data-module-name") || "-";
    const teacher_code = trigger.getAttribute("data-teacher-code") || "-";
    const teacher_name = trigger.getAttribute("data-teacher-name") || "-";
    const semester = trigger.getAttribute("data-semester") || "-";
    let start = trigger.getAttribute("data-start");
    let end = trigger.getAttribute("data-end");

    const formatStart = start ? dayjs(start).format("DD/MM/YYYY") : "-";
    const formatEnd = start ? dayjs(end).format("DD/MM/YYYY") : "-";

    document.getElementById("modal-class-code").textContent = class_code;
    document.getElementById("modal-class-name").textContent = class_name;
    document.getElementById("modal-module-code").textContent = module_code;
    document.getElementById("modal-module-name").textContent = module_name;
    document.getElementById("modal-teacher-code").textContent = teacher_code;
    document.getElementById("modal-teacher-name").textContent = teacher_name;
    document.getElementById("modal-semester").textContent = semester;
    document.getElementById("modal-start").textContent = formatStart;
    document.getElementById("modal-end").textContent = formatEnd;
  });
