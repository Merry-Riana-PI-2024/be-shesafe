const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const allRoute = require("./routes");
const db = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  credentials: true, 
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  next();
});

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
