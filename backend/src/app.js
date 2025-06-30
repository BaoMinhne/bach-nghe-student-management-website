const express = require("express");
const cors = require("cors");
const JSend = require("./jsend");
const knex = require("./database/knex");
const session = require("express-session");

const authRouter = require("./routes/auth.router");
const studentRouter = require("./routes/student.router");
const teacherRouter = require("./routes/teacher.router");
const adminRouter = require("./routes/admin.router");

const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");

const app = express();

/**
 * Cấu hình CORS cho các nguồn frontend được phép.
 */
app.use(
  cors({
    origin: [
      "http://localhost:5501",
      "http://localhost",
      "http://127.0.0.1:5501",
    ],
    credentials: true,
  })
);

/**
 * Middleware xử lý dữ liệu JSON và form.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Cấu hình phiên làm việc với express-session.
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

/**
 * Kiểm tra kết nối với cơ sở dữ liệu.
 * @route GET /api/check-connection
 */
app.get("/api/check-connection", async (req, res) => {
  try {
    await knex.raw("SELECT 1");
    res.json({ message: "Connect Successfully!" });
  } catch (error) {
    res.status(500).json({
      error: "Cannot Connect Successfully!",
      details: error.message,
    });
  }
});

/**
 * Route mặc định trả về response thành công.
 * @route GET /
 */
app.get("/", (req, res) => {
  return res.json(JSend.success());
});

/**
 * Route phục vụ tài nguyên tĩnh từ thư mục /public.
 * @route GET /public/*
 */
app.use("/public", express.static("public"));

/**
 * Khởi tạo router cho các nhóm chức năng chính.
 */
authRouter.setup(app);
studentRouter.setup(app);
teacherRouter.setup(app);
adminRouter.setup(app);

/**
 * Middleware xử lý 404 khi không tìm thấy route.
 */
app.use(resourceNotFound);

/**
 * Middleware xử lý lỗi chung.
 */
app.use(handleError);

module.exports = app;
