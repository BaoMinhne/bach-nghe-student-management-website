document.addEventListener("DOMContentLoaded", async () => {});

document
  .getElementById("addNewAccountForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const accounts = selectedRows();
    if (accounts.length === 0) {
      Swal.fire("Thông báo", "Bạn chưa chọn tài khoản nào!", "warning");
      return;
    }

    await addNewAccount(accounts);
  });

function selectedRows() {
  const selectedRows = document.querySelectorAll("#form-list tr");
  const accounts = [];

  selectedRows.forEach((row) => {
    const checkbox = row.querySelector(".checkbox-input");
    const passwordInput = row.querySelector(".password-input");
    const usernameSpan = row.querySelector("td:nth-child(2) span");

    if (checkbox && checkbox.checked) {
      const username = usernameSpan?.textContent?.trim();
      const password = passwordInput?.value?.trim();

      if (username && password) {
        accounts.push({
          username: username,
          pass: password,
          role: currentRole,
        });
      }
    }
  });

  return accounts;
}

async function addNewAccount(datas) {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/addNewAccount`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datas),
    });

    const result = await res.json();

    if (result.status === "success") {
      Swal.fire("Thành công", "Đã tạo tài khoản thành công!", "success");
      await loadListByRole();
    } else {
      Swal.fire("Lỗi", result.message || "Tạo tài khoản thất bại!", "error");
    }
  } catch (err) {
    console.error("Lỗi khi gửi dữ liệu:", err);
    Swal.fire("Lỗi", "Không thể gửi yêu cầu tạo tài khoản!", "error");
  }
}
