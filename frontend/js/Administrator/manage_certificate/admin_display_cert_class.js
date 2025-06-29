document.addEventListener("DOMContentLoaded", function () {
  getCertClass();
});

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
