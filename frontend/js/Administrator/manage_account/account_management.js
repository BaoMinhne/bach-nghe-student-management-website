/**
 * Sự kiện sau khi DOM đã tải xong: khởi tạo toggle password, modal, sự kiện submit,
 * và lấy danh sách tài khoản.
 */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", function () {
      const input = this.previousElementSibling;
      const isPassword = input.type === "password";

      input.type = isPassword ? "text" : "password";

      // Đổi icon
      this.classList.toggle("bi-eye-fill", isPassword);
      this.classList.toggle("bi-eye-slash-fill", !isPassword);
    });
  });

  const inputs = document.querySelectorAll(".password-field");

  inputs.forEach((input) => {
    input.style.width = input.value.length + 1 + "ch";
  });

  const editModal = document.getElementById("editModal");
  editModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const code = button.getAttribute("data-editMaSV");
    const passwd = button.getAttribute("data-editMatKhau");
    const name = button.getAttribute("data-editTen");
    const status = button.getAttribute("data-editTrangThai");

    document.getElementById("editMaSV").value = code;
    document.getElementById("editMaSV").readOnly = true;
    document.getElementById("editMatKhau").value = passwd;
    document.getElementById("editTen").value = name;
    document.getElementById("editTen").readOnly = true;
    document.getElementById("editTrangThai").value = status;
  });

  document.getElementById("editForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn reload trang
    const currentCode = document.getElementById("editMaSV").value;
    const newPassword = document.getElementById("editMatKhau").value;
    const newStatus = document.getElementById("editTrangThai").value;
    console.log("Current Code:", currentCode);
    console.log("New Password:", newPassword);
    console.log("New Status:", newStatus);
    updateAccount(currentCode, newPassword, newStatus);
  });

  getAccountList();
});

/**
 * Gửi yêu cầu API để lấy danh sách toàn bộ tài khoản.
 * Gán kết quả vào listAccount và gọi hàm hiển thị.
 */
async function getAccountList() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getAccountList`);
    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      console.log("Account:", result.data);
      listAccount = result.data;
      searchAccounts = [...listAccount];
      renderListAccount(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

const limitRows = 5;
let currentPage = 1;
let listAccount = [];
let searchAccounts = [];

/**
 * Gán danh sách dữ liệu tài khoản cần hiển thị và thực hiện hiển thị theo trang.
 * @param {Array<Object>} datas - Danh sách tài khoản.
 */
function renderListAccount(datas) {
  searchAccounts = datas;
  displayListAccount(currentPage);
  renderPagination();
}

/**
 * Tạo các nút phân trang dựa trên số lượng tài khoản và trang hiện tại.
 */
function renderPagination() {
  const totalPages = Math.ceil(searchAccounts.length / limitRows);
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
 * Tạo nút phân trang.
 * @param {string|number} label - Nội dung nút (số trang hoặc ký tự).
 * @param {number} pageNum - Số trang tương ứng.
 * @returns {HTMLLIElement} - Phần tử nút trang.
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
    displayListAccount(currentPage);
    renderPagination();
  });
  li.appendChild(a);
  return li;
}

/**
 * Tạo phần tử dấu ba chấm (...) trong phân trang.
 * @returns {HTMLLIElement} - Phần tử dấu ba chấm.
 */
function createEllipsis() {
  const li = document.createElement("li");
  li.className = "page-item disabled";
  li.innerHTML = `<span class="page-link">...</span>`;
  return li;
}

/**
 * Hiển thị danh sách tài khoản tương ứng với trang hiện tại.
 * @param {number} page - Trang cần hiển thị.
 */
function displayListAccount(page) {
  const accountList = document.getElementById("account-list");
  accountList.innerHTML = ""; // Clear existing rows
  const start = (page - 1) * limitRows;
  const end = start + limitRows;
  const items = searchAccounts.slice(start, end);

  items.forEach((account, index) => {
    const row = document.createElement("tr");

    // Tạo input password
    const passwordField = document.createElement("input");
    passwordField.type = "password";
    passwordField.className = "unstyled-input password-field";
    passwordField.value = account.user_pass;
    passwordField.readOnly = true;
    passwordField.style.width = passwordField.value.length + 1 + "ch";

    // Icon toggle
    const eyeIcon = document.createElement("i");
    eyeIcon.className = "bi bi-eye-slash-fill toggle-password";
    eyeIcon.style.cursor = "pointer";
    eyeIcon.addEventListener("click", function () {
      const isHidden = passwordField.type === "password";
      passwordField.type = isHidden ? "text" : "password";
      eyeIcon.className = isHidden
        ? "bi bi-eye-fill toggle-password"
        : "bi bi-eye-slash-fill toggle-password";
    });

    // Tên tài khoản (tuỳ role)
    let name = "-";
    if (account.user_role === "Học viên" && account.info) {
      name = `${account.info.student_middle_name} ${account.info.student_name}`;
    } else if (account.user_role === "Giảng viên" && account.info) {
      name = account.info.teacher_name;
    }

    let statusText =
      account.user_status === 1 ? "Đang hoạt động" : "Ngừng hoạt động";
    if (account.user_status === 0) {
      statusText = `<span class="text-danger">${statusText}</span>`;
    } else if (account.user_status === 1) {
      statusText = `<span class="text-primary">${statusText}</span>`;
    }
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${account.user_username}</td>
      <td></td>
      <td>${name}</td>
      <td>${account.user_role}</td>
      <td>${statusText}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1 btn-edit" 
			data-bs-toggle="modal"
			data-bs-target="#editModal"
			data-editMaSV="${account.user_username}"
  			data-editMatKhau="${account.user_pass}"
  			data-editTen="${name}"
			data-editTrangThai="${account.user_status}">
          <i class="bi bi-pencil-square"></i> Sửa
        </button>
      </td>
    `;

    // Thêm input password và icon vào cột thứ 3
    const passwordCell = row.children[2];
    passwordCell.appendChild(passwordField);
    passwordCell.appendChild(eyeIcon);

    accountList.appendChild(row);
  });
}

/**
 * Gửi API lấy danh sách tài khoản của học viên.
 * Gọi render sau khi lấy dữ liệu thành công.
 */
async function getStudentAccount() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getStudentAccount`);
    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      console.log("Student Account:", result.data);
      renderListAccount(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu sinh viên!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu sinh viên!", "error");
  }
}

/**
 * Gửi API lấy danh sách tài khoản của giảng viên.
 * Gọi render sau khi lấy dữ liệu thành công.
 */
async function getTeacherAccount() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getTeacherAccount`);
    const result = await res.json();

    if (result.status === "success" && Array.isArray(result.data)) {
      console.log("Teacher Account:", result.data);
      renderListAccount(result.data);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu giảng viên!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu giảng viên!", "error");
  }
}

/**
 * Lọc tài khoản theo vai trò được chọn từ select box.
 */
function filterAccounts() {
  const fliter = document.getElementById("role_filter").value;

  switch (fliter) {
    case "1":
      getStudentAccount();
      break;
    case "2":
      getTeacherAccount();
      break;
    case "all":
      getAccountList();
  }
}

/**
 * Gửi yêu cầu cập nhật mật khẩu và trạng thái của tài khoản.
 *
 * @param {string} currentCode - Tên đăng nhập (username).
 * @param {string} newPassword - Mật khẩu mới.
 * @param {number|string} newStatus - Trạng thái mới (0 hoặc 1).
 */
async function updateAccount(currentCode, newPassword, newStatus) {
  const API_BASE = "http://localhost:3000";

  if (!currentCode || !newPassword || !newStatus) {
    Swal.fire("Lỗi", "Thiếu dữ liệu để cập nhật điểm!", "error");
    return;
  }

  console.log("update: " + currentCode, newPassword, newStatus);
  console.log("Status:", typeof newStatus, JSON.stringify(newStatus));
  newStatus = Number(newStatus);
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/updateAccount`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentCode,
        newPassword,
        newStatus,
      }),
    });

    const data = await res.json();

    if (data.status === "success") {
      Swal.fire("Thành công", "Cập nhật thành công!", "success");
      getAccountList();
    } else {
      Swal.fire("Lỗi", data.message || "Không thể cập nhật điểm!", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật điểm!", "error");
  }
}

/**
 * Bắt sự kiện nhập liệu vào ô tìm kiếm, lọc danh sách tài khoản theo tên hoặc username.
 */
document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.trim().toLowerCase();

  const filtered = listAccount.filter((account) => {
    const fullName = account.info
      ? `${account.info.student_middle_name || ""} ${
          account.info.student_name || ""
        }`.toLowerCase()
      : "";

    const teacherName = account.info?.teacher_name?.toLowerCase() || "";

    return (
      account.user_username.toLowerCase().includes(keyword) ||
      fullName.includes(keyword) ||
      teacherName.includes(keyword)
    );
  });

  currentPage = 1;
  renderListAccount(filtered);
});
