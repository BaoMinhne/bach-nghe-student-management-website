let listModule = [];

// ===== SỰ KIỆN CLICK VÀO NÚT CẤP CHỨNG CHỈ =====
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

// ===== HÀM GỬI REQUEST THÊM CHỨNG CHỈ =====
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

// ===== LẤY DANH SÁCH HỌC SINH ĐƯỢC CHECK =====
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

// ===== SUBMIT FORM CẤP NHIỀU CHỨNG CHỈ =====
document.getElementById("addNewCert").addEventListener("submit", async (e) => {
  e.preventDefault();
  const students = selectedRows();

  if (students.length === 0) {
    Swal.fire("Thông báo", "Bạn chưa chọn học sinh nào!", "warning");
    return;
  }

  await addCertificates(students, class_subject_id);
});

// ===== LẤY DANH SÁCH MÔN HỌC =====
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

// ===== SỰ KIỆN LOAD TRANG =====
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

// ===== SỰ KIỆN CHỌN MÔN HỌC =====
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
  renderStudentList(filtered); // dùng danh sách học viên
});
