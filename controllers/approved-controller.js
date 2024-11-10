const Cases = require("../models/Cases");
const User = require("../models/User");
require("dotenv").config();
const nodemailer = require("nodemailer");
// const { ObjectId } = require("mongoose").Types;

module.exports = {
  getDataCases: async (req, res) => {
    const data = await Cases.find({});
    res.status(200).json({
      message: "berhasil mendapatkan data",
      data,
    });
  },

  getDataUser: async (req, res) => {
    const data = await User.find({});
    res.status(200).json({
      message: "berhasil mendapatkan data",
      data,
    });
  },

  approvedCases: async (req, res) => {
    // const { id } = req.params;
    const { isApproved, notes, isAnonimous, _id } = req.body;
    const { adminId } = req.admin;

    const counter = Math.round(Math.random() * 1e9);

    try {
      const updateApprove = await Cases.findOneAndUpdate(
        { _id },
        {
          approvedBy: adminId,
          isAnonimous: "Anonim" + counter,
          isApproved,
          notes,
          approved: new Date(),
        }
      );

      if (updateApprove) {
        res.status(200).json({
          message: "Approve berhasil",
          updateApprove,
        });
      } else {
        res.status(404).json({
          message: "Dokumen tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Error:", error); // Logging error for debugging
      res.status(400).json({
        message: "Gagal",
        error: error.message,
      });
    }
  },

  approvedUser: async (req, res) => {
    // const { id } = req.params;
    const { isValidated, _id } = req.body;
    const { adminId } = req.admin;

    try {
      const updateValidate = await User.findOneAndUpdate(
        { _id },
        {
          validatedBy: adminId,
          isValidated,
          validated: new Date(),
        }
      );

      if (updateValidate) {
        if (isValidated === "validated") {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          const logo =
            "https://drive.google.com/uc?id=1V4KlEDZT_TTSqAF9oje2dsOaHvNwzocY";
          // Menyiapkan opsi email
          const mailOptions = {
            from: process.env.SMTP_USER,
            to: updateValidate.email,
            subject: "SHESAFE | Konfirmasi: Identitas Anda Telah Tervalidasi",
            html: `
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Validasi Identitas</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
              }
             .container {
            max-width: 600px;
            margin: auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
           
        }
              h1 {
                  color: #333;
              }
              p {
                  font-size: 16px;
                  color: #555;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007BFF;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
                  .button a {
                  color:white;
                  }
              .logo {
                  max-width: 30%;
                  height: auto;
                  margin-bottom: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <img src=${logo} class="logo">
              <h1>Selamat, ${updateValidate.fullName}!</h1>
              <p>Identitas Anda telah berhasil tervalidasi. Anda kini dapat melakukan login untuk mengakses akun Anda.</p>
              <a href="URL_LOGIN_ANDA" class="button">Login Sekarang</a>
          </div>
      </body>
      </html>
    `,
          };

          // Mengirim email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log("Email sent: " + info.response);
          });
        }
        res.status(200).json({
          message: "Berhasil Memvalidasi identitas user",
          updateValidate,
        });
      } else {
        res.status(404).json({
          message: "Dokumen tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(400).json({
        message: "Gagal",
        error: error.message,
      });
    }
  },
};
