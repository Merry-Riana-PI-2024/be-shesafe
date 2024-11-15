require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const allRoute = require("./routes");
const db = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      // const allowedOrigins = process.env.ALLOWED_ORIGINS;

      console.log("Incoming Origin:", origin);

      if (!origin) {
        return callback(null, true); // Izinkan permintaan tanpa origin
      }

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `This origin ${origin} is not allowed.`;
        console.log(msg);
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },

    methods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
});

app.options("*", cors());

// Middleware: Cache control
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// Middleware: JSON and Cookies
app.use(express.json());
app.use(cookieParser());

db.then(() => {
  console.log("berhasil connect ke database");
}).catch((e) => {
  console.log("gagal connect ke database");
  console.log(e);
});

app.listen(PORT, () => {
  console.log("server running on PORT " + PORT);
});

app.use(allRoute);
