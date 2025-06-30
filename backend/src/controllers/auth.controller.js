const authService = require("../models/auth.model");
const JSend = require("../jsend");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");

/**
 * Đăng nhập người dùng.
 *
 * @route POST /api/auth/login
 * @param {import('express').Request} req - Yêu cầu HTTP chứa username và password.
 * @param {import('express').Response} res - Phản hồi HTTP trả về token và thông tin người dùng.
 * @param {import('express').NextFunction} next - Middleware xử lý lỗi.
 * @returns {Promise<void>}
 */
async function login(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ApiError(400, "Username and password are required"));
  }

  try {
    const user = await authService.login(username, password);

    if (!user) {
      return next(new ApiError(401, "Invalid username or password"));
    }

    // Tạo JWT token (bạn có thể điều chỉnh secret và thời gian hết hạn)
    const token = jwt.sign(
      {
        id: user.user_id,
        username: user.user_username,
        role: user.user_role,
        status: user.user_status,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "48h",
      }
    );

    res.json(
      JSend.success({
        message: "Login successful",
        token,
        user: {
          id: user.user_id,
          username: user.user_username,
          role: user.user_role,
          status: user.user_status,
        },
      })
    );
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid username or password"));
  }
}

/**
 * Đăng xuất người dùng (huỷ session).
 *
 * @route POST /api/auth/logout
 * @param {import('express').Request} req - Yêu cầu HTTP chứa session hiện tại.
 * @param {import('express').Response} res - Phản hồi xác nhận đăng xuất.
 * @returns {Promise<import('express').Response>}
 */
async function logout(req, res) {
  req.session.destroy();
  return res.status(200).json(JSend.success({ message: "Logout successful" }));
}

module.exports = {
  login,
  logout,
};
