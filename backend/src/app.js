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

app.use(
  cors({
    origin: [
      "http://localhost:5501",
      "http://localhost",
      "http://127.0.0.1:5501",
    ],
    credentials: true, // Cho phép gửi cookie qua CORS
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

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

app.get("/", (req, res) => {
  return res.json(JSend.success());
});

app.use("/public", express.static("public"));

authRouter.setup(app);
studentRouter.setup(app);
teacherRouter.setup(app);
adminRouter.setup(app);

//handle 404 response
app.use(resourceNotFound);

app.use(handleError);

module.exports = app;
