let listModule = [];

/**
 * Sự kiện click vào nút "Duyệt chứng chỉ" trên từng dòng học viên.
 * Gửi mã học viên và class_subject_id để thực hiện Duyệt chứng chỉ.
 */
document.getElementById("form-list").addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-addCert");
  if (!btn) return;

  const stCode = btn.getAttribute("data-code");
  const clsID = btn.getAttribute("data-class-subject");

  if (!stCode || !clsID) {
    console.log("Không lấy được dữ liệu");
    return;
  }

  console.log("stCode", stCode);
  console.log("clsID", clsID);

  await addCertificates(stCode, clsID);
});

/**
 * Gửi yêu cầu API để cấp chứng chỉ cho học viên (hoặc danh sách học viên).
 *
 * @param {string|string[]} stCode - Mã học viên (hoặc danh sách mã).
 * @param {string|number} clsID - ID của lớp học phần (class_subject_id).
 * @returns {Promise<void>}
 */
async function addCertificates(stCode, clsID) {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/addCertificates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        class_subject_id: Number(clsID),
        student_codes: Array.isArray(stCode) ? stCode : [stCode],
      }),
    });

    const result = await res.json();

    if (result.status === "success") {
      getStudentEligible?.(); // nếu có hàm làm mới danh sách
      Swal.fire("Thành Công", "Cấp chứng chỉ thành công!", "success");
    } else {
      Swal.fire("Lỗi", result.message || "Không thành công!", "error");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    Swal.fire("Lỗi", err.message || "Lỗi hệ thống", "error");
  }
}

/**
 * Lấy danh sách mã học viên từ các dòng được checkbox chọn.
 *
 * @returns {string[]} - Mảng các mã học viên.
 */
function selectedRows() {
  const checkboxes = document.querySelectorAll(".checkbox-input");
  const students = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest("tr");
      const studentCode = row
        ?.querySelector("td:nth-child(2)")
        ?.textContent?.trim();
      if (studentCode) students.push(studentCode);
    }
  });

  return students;
}

/**
 * Sự kiện click vào nút "Phê duyệt" để cấp chứng chỉ hàng loạt.
 * Gọi `addCertificates` với danh sách mã học viên được chọn.
 */
document.getElementById("btnApprove").addEventListener("click", async (e) => {
  e.preventDefault();
  const students = selectedRows();

  if (students.length === 0) {
    Swal.fire("Thông báo", "Bạn chưa chọn học sinh nào!", "warning");
    return;
  }

  await addCertificates(students, class_subject_id);
});

/**
 * Gửi yêu cầu API để lấy danh sách môn học (module) để lọc.
 *
 * @returns {Promise<Array<Object>>} - Danh sách các môn học, hoặc [] nếu lỗi.
 */
async function getModuleFilter() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getModuleFilter`);
    const result = await res.json();
    if (result.status === "success") return result.data;
    Swal.fire(
      "Lỗi",
      result.message || "Không lấy được danh sách môn học",
      "error"
    );
  } catch (err) {
    console.error("Lỗi khi gửi dữ liệu:", err);
    Swal.fire("Lỗi", "Không thể kết nối máy chủ", "error");
  }
  return [];
}

/**
 * Sự kiện DOMContentLoaded: lấy danh sách môn học và hiển thị trong dropdown lọc.
 * Gán vào biến toàn cục `listModule` và `filterDatas`.
 */
document.addEventListener("DOMContentLoaded", async () => {
  listModule = await getModuleFilter();
  filterDatas = [...listModule];

  const moduleFilter = document.getElementById("courseFilter");
  moduleFilter.innerHTML = `<option value="">-- Chọn môn học --</option>`;

  listModule.forEach((item) => {
    const moduleItem = document.createElement("option");
    moduleItem.value = item.module_code;
    moduleItem.textContent = `${item.module_code} - ${item.module_name}`;
    moduleFilter.appendChild(moduleItem);
  });
});

/**
 * Sự kiện khi người dùng chọn môn học từ dropdown.
 * Lọc danh sách học viên theo mã hoặc tên môn học.
 */
document.getElementById("courseFilter").addEventListener("change", function () {
  const keyword = this.value.trim().toLowerCase();

  const filtered = studentDatas.filter((student) => {
    return (
      student.module_code.toLowerCase().includes(keyword) ||
      student.module_name.toLowerCase().includes(keyword)
    );
  });

  currentPage = 1;
  filterDatas = filtered;
  renderStudentList(filtered);
});
