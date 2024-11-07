const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const allRoute = require("./routes");
const db = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true //allow cookies to be sent with request
}));
app.use((req, res, next) => {
  //res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Ganti '*' dengan domain frontend jika perlu (misalnya, 'http://localhost:3001')
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  next();
});

//kalau dideploy pake ini yak
// app.use(cors({
//   origin: 'https://domain-frontend-anda.com',
//   methods: 'GET, POST, PUT, DELETE, OPTIONS',
//   allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
// }));

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

app.use(express.json());

app.use(allRoute);
