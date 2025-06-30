/**
 * Đối tượng `Storage` dùng để quản lý thông tin đăng nhập của người dùng
 * thông qua `localStorage`, bao gồm lưu, lấy và xóa token và user.
 * Được gắn vào `window` để sử dụng toàn cục.
 */
const Storage = {
  /**
   * Lưu thông tin người dùng và token vào `localStorage`.
   *
   * @param {Object} user - Đối tượng thông tin người dùng.
   * @param {string} token - Mã thông báo xác thực JWT.
   */
  saveUser: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  },

  /**
   * Lấy thông tin người dùng từ `localStorage`.
   *
   * @returns {Object|null} - Đối tượng người dùng hoặc `null` nếu không có.
   */
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Lấy `token` xác thực từ `localStorage`.
   *
   * @returns {string|null} - Token JWT hoặc `null` nếu không tồn tại.
   */
  getToken: () => localStorage.getItem("token"),

  /**
   * Lấy vai trò (role) của người dùng hiện tại.
   *
   * @returns {number|null} - Mã vai trò (ví dụ: 0 = admin, 1 = student, 2 = teacher) hoặc `null`.
   */
  getRole: () => {
    const user = Storage.getUser();
    return user ? user.role : null;
  },

  /**
   * Kiểm tra xem người dùng đã đăng nhập hay chưa.
   *
   * @returns {boolean} - `true` nếu có token, ngược lại `false`.
   */
  isLoggedIn: () => !!Storage.getToken(),

  /**
   * Xóa toàn bộ thông tin người dùng và token khỏi `localStorage`.
   */
  clear: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
};

// Gắn đối tượng Storage lên `window` để có thể sử dụng toàn cục
window.Storage = Storage;
