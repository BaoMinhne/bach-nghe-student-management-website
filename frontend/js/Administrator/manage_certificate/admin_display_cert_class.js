/**
 * Sự kiện được gọi khi toàn bộ DOM đã tải hoàn tất.
 * Gọi hàm `getCertClass` để lấy dữ liệu các lớp đã được cấp chứng chỉ.
 */
document.addEventListener("DOMContentLoaded", function () {
  getCertClass();
});

/**
 * Gửi yêu cầu API để lấy danh sách các lớp học đã cấp chứng chỉ.
 * Nếu thành công, gọi hàm `renderCertClass` để hiển thị dữ liệu.
 *
 * @returns {Promise<void>}
 */
async function getCertClass() {
  const API_BASE = "http://localhost:3000";
  try {
    const res = await fetch(`${API_BASE}/api/v1/admin/getClassCert`);

    const result = await res.json();
    console.log("result: ", result);

    if (result.status === "success") {
      const CertClass = result.data;
      renderCertClass(CertClass);
    } else {
      Swal.fire("Thông báo", "Không lấy được dữ liệu!", "warning");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Lỗi khi lấy dữ liệu!", "error");
  }
}

/**
 * Tạo và hiển thị danh sách các lớp học đã cấp chứng chỉ dưới dạng thẻ (card).
 *
 * @param {Array<Object>} CertClasses - Mảng đối tượng chứa thông tin lớp, giảng viên, môn học, class_subject_id.
 *
 * Mỗi phần tử phải có cấu trúc:
 * {
 *   module_code: string,
 *   module_name: string,
 *   teacher_name: string,
 *   class_name: string,
 *   class_subject_id: number
 * }
 */
function renderCertClass(CertClasses) {
  const certClassList = document.querySelector(".class-cert-list");
  certClassList.innerHTML = ""; // Xoá nội dung cũ

  CertClasses.forEach((CertClasses) => {
    const div = document.createElement("div");
    div.className = "col-md-3 col-sm-6";
    div.innerHTML = `
	<div class="card ">
		<img src="../images/b3.jpg" class="card-img-top" alt="..." />
		<div class="card-body">
		<h5 class="card-title marquee-hover text-center">
			<span>${CertClasses.module_code} - ${CertClasses.module_name}</span>
		</h5>
		<p
			class="card-text card_teacher_name marquee-hover text-center"
		>
			<span>${CertClasses.teacher_name}</span>
		</p>
		<p class="card-text card_class_name marquee-hover text-center">
			<span>Class: ${CertClasses.class_name}</span>
		</p>
		<div class="text-center">
			<button
			class="btn btn-primary"
			onclick="location.href='page_certificate.html?module=${CertClasses["module_code"]}&class_subject=${CertClasses["class_subject_id"]}&class_name=${CertClasses["class_name"]}&module_name=${CertClasses["module_name"]}'"
			>
			Access
			</button>
		</div>
		</div>
	</div>
	`;
    certClassList.appendChild(div);
  });
}
