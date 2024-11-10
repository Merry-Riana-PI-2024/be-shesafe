const Journal = require("../models/Journal");
require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = {
  //jurnal yang hanya bisa diliat oleh user itu sendiri,
  getJournalByIdUser: async (req, res) => {
    //rename nama function
    const { userId } = req.user; //tambah req.user
    const { page = 1, perPage = 10, sort = "desc" } = req.query; //rename limit to perPage
    const sortOrder = sort === "asc" ? 1 : -1;

    try {
      const data = await Journal.find({ createdBy: userId }) // tambah createdBy:userId
        .populate("createdBy", "fullName")
        .populate("category", "name")
        .sort({ created: sortOrder })
        .skip((page - 1) * perPage)
        .limit(perPage);

      const total = await Journal.countDocuments();
      res.json({
        message: "Berhasil mendapatkan semua Journal",
        data,
        totalPages: Math.ceil(total / perPage),
        currentPage: page,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gagal mendapatkan jurnal", error: error.message });
    }
  },

  getDetailJournal: async (req, res) => {
    const { id } = req.params;

    const findJournal = await Journal.findById(id).populate("category", "name");

    res.json({
      message: "Berhasil mendapatkan detail Journal by id",
      findJournal,
    });
  },

  // Vita: tambah kondisi createdBy dari payload req.user
  addJournal: async (req, res) => {
    const data = req.body;
    const { userId } = req.user;

    // Check if file uploaded
    if (req.file) {
      console.log("File uploaded: ", req.file);
      data.file = `${req.file.filename}`;
    } else {
      console.log("No file uploaded");
    }

    const newJournal = new Journal({ ...data, createdBy: userId });
    try {
      const savedJournal = await newJournal.save();

      // Hitung jumlah jurnal yang telah ditulis oleh pengguna
      const journalCount = await Journal.countDocuments({ createdBy: userId });

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

      // Fungsi untuk mengirim email notifikasi refleksi
      const sendReflectionEmail = (subject, message) => {
        const mailOptions = {
          from: process.env.SMTP_USER,
          to: req.user.email,
          subject: subject,
          html: `
                    <!DOCTYPE html>
                    <html lang="id">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Notifikasi Refleksi</title>
                        <style>
                            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                            .container { max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 20px; }
                            h1 { color: #333; }
                            p { font-size: 16px; color: #555; }
                            .logo { max-width: 30%; height: auto; margin-bottom: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <img src=${logo} class="logo">
                            <h1>Notifikasi Refleksi</h1>
                            <p>${message}</p>
                        </div>
                    </body>
                    </html>
                `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Email sent: " + info.response);
        });
      };

      // Mengirim email berdasarkan jumlah jurnal yang ditulis
      switch (journalCount) {
        case 1:
          sendReflectionEmail(
            "SheSafe:Refleksi Hari Pertama",
            "Hai, bagaimana kabarmu hari ini? Terima kasih sudah membagikan ceritamu kemarin. Jika merasa butuh waktu, tidak apa-apa, kami di sini untuk mendukungmu."
          );
          break;
        case 3:
          sendReflectionEmail(
            "SheSafe:Refleksi Hari Ketiga",
            "Halo, apakah kamu merasa lebih baik? Kadang menulis bisa membantu meredakan perasaan. Jangan lupa, kamu bisa mengajukan kasus kapan saja jika merasa perlu. Kami selalu siap mendukung."
          );
          break;
        case 7:
          sendReflectionEmail(
            "SheSafe:Refleksi Hari Ketujuh",
            "Hai, bagaimana perasaanmu setelah seminggu berlalu? Jangan ragu untuk kembali menulis atau melihat jurnal yang kamu buat. Jika butuh bantuan, ingatlah bahwa kamu tidak sendiri."
          );
          break;
        case 14:
          sendReflectionEmail(
            "SheSafe:Refleksi Hari Keempat Belas",
            "Hai, sudah dua minggu sejak kamu menulis jurnal. Apakah kamu ingin melanjutkan ceritamu atau butuh dukungan lebih? Tim SheSafe siap mendengarkan kapan saja."
          );
          break;
        case 30:
          sendReflectionEmail(
            "SheSafe:Refleksi Hari Ketigapuluh",
            "Sudah satu bulan sejak kamu membagikan pengalamanmu. Jika kamu merasa ada hal baru yang ingin dibagikan atau butuh bantuan, kami di sini mendukungmu. Tetap kuat dan ingat, kamu memiliki komunitas yang peduli."
          );
          break;
        default:
          break; // Tidak ada email yang dikirim jika jumlah tidak sesuai
      }

      res.json({
        message: "Journal berhasil dibuat",
        savedJournal,
      });
    } catch (error) {
      console.log("Error saving journal", error);
      res.json({
        message: "Gagal buat Journal",
      });
    }
  },

  editJournal: async (req, res) => {
    const { id } = req.params;

    const editData = {
      ...req.body,
      edited: new Date(), //auto set edit date
    };

    if (req.file) {
      console.log("File uploaded: ", req.file);
      editData.file = `${req.file.filename}`;
    }

    const updatedJournal = await Journal.findByIdAndUpdate(id, editData, {
      new: true,
    });
    res.json({
      message: "Berhasil update Journal",
      updatedJournal,
    });
  },

  deleteJournal: async (req, res) => {
    const { id } = req.params;

    await Journal.findByIdAndDelete(id);

    res.json({
      message: "Berhasil hapus Journal",
    });
  },
};
