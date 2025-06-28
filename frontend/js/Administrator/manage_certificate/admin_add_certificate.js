document.getElementById("form-list").addEventListener("click", async (e) => {
  if (e.target.closest(".btn-addCert")) {
    const btn = e.target.closest(".btn-addCert");
    const stCode = btn.getAttribute("data-code");
    const clsID = btn.getAttribute("data-class-subject");

    if (!stCode || !clsID) {
      console.log("Không lấy được dữ liệu");
      return;
    }

    console.log("stCode", stCode);
    console.log("clsID", clsID);

    addCertificates(stCode, clsID);
  }
});

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
        student_codes: [stCode],
      }),
    });

    const result = await res.json();

    if (result.status === "success") {
      getStudentEligible();
      swal.fire("Thành Công", "Cấp chứng chỉ thành công!", "success");
    } else {
      swal.fire("Lỗi", `Lỗi: ${result.message}`, "error");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    swal.fire("Lỗi", `Lỗi: ${err.message}`, "error");
  }
}

function selectedRows() {
  const checkboxes = document.querySelectorAll(".checkbox-input");
  const students = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest("tr");
      const studentCode = row
        .querySelector("td:nth-child(2)")
        .textContent.trim();
      students.push(studentCode);
    }
  });

  return students;
}

document
  .getElementById("addNewCert")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const students = selectedRows();
    if (students.length === 0) {
      Swal.fire("Thông báo", "Bạn chưa chọn học sinh nào!", "warning");
      return;
    }

    await addCertificates(class_subject_id, students);
  });
