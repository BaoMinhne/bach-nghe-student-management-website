const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const username = loginForm.querySelector('input[type="text"]').value;
                const password = loginForm.querySelector('input[type="password"]').value;
                
                if (username && password) {
                    alert('Đăng nhập thành công! Username: ' + username);
                } else {
                    alert('Vui lòng nhập đầy đủ thông tin!');
                }
            });
        } else {
            console.error('Không tìm thấy form đăng nhập!');
        }