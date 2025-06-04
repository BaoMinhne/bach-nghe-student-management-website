const authService = require("../models/auth.model");
const JSend = require("../jsend");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");

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

    res.json({
      message: "Login successful, Hello " + user.user_username,
      status: "success",
      token,
      user: {
        id: user.user_id,
        username: user.user_username,
        role: user.user_role,
        status: user.user_status,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(401, "Invalid username or password"));
  }
}

async function logout(req, res) {
  req.session.destroy();
  return res.status(200).json(JSend.success({ message: "Logout successful" }));
}

module.exports = {
  login,
  logout,
};
