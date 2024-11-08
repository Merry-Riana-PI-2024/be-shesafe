const Cases = require("../models/Cases");
const Journal = require("../models/Journal");

module.exports = {
   // Fungsi untuk mendapatkan semua kasus dengan pagination dan status
   getCases: async (req, res) => {
    const { status = "", page = 1, perPage = 10 } = req.query; //rename limit jadi perPage

    try {
      const cases = await Cases.find(status ? { isApproved: status } : {})
        .sort({ created: "desc" })
        .skip((page - 1) * perPage)
        .limit(Number(perPage));

      const totalCases = await Cases.countDocuments(status ? { isApproved: status } : {});

      res.status(200).json({
        message: "Berhasil mendapatkan semua kasus",
        totalCases,
        totalPages: Math.ceil(totalCases / perPage),
        currentPage: page,
        cases,
      });
    } catch (error) {
      console.error("Error getting cases with status filter", error);
      res.status(500).json({
        message: "Gagal mendapatkan kasus",
        error: error.message,
      });
    }
  },

  getCases_bcp: async (req, res) => {
    const { userId } = req.user;
    const Status = req.query.status || "";

    const data = await Cases.find({
      createdBy: userId,
      isApproved: Status,
    }).sort({
      created: "desc",
    });

    res.json({
      message: "berhasil mendapatkan data semua user",
      data,
    });
  },

  //ajukan kasus dengan get data jurnal dulu , biar autofilled di form
  getJournalforCasesByID: async (req, res) => {
    const { id } = req.params; //idjurnal
    const data = await Journal.findOne({ _id: id });

    if (data) {
      res.status(200).json({
        message: "data jurnal berhasil tampil",
        data,
      });
    } else {
      res.status(400).json({
        message: "data jurnal tidak ditemukan",
      });
    }
  },

  //ini dari form pengajuan ketik pilih journal
  getJournalById: async (req, res) => {
    const Journal = req.query.JournalID || "";
    const data = await Journal.find({ _id: Journal });
    if (data) {
      res.status(200).json({
        message: "data jurnal berhasil ditampilkan",
        data,
      });
    } else {
      res.status(400).json({
        message: "data jurnal tidak ditemukan",
      });
    }
  },

  getCasesById: async (req, res) => {
    // const { userId } = req.user;

    try {
      const { id } = req.params;
      const data = await Cases.findById({ _id: id });

      res.status(200).json({
        message: "berhasilmelihat detail",
        data,
      });
    } catch (error) {
      res.status(404).json({
        message: "gagal mendapatkan data",
      });
    }
  },
 

  addCases: async (req, res) => {
    const { userId } = req.user;
    const { title, description, category, message, journalID } = req.body;

    if (!title) {
      return res.json({
        message: "Judul Kasus tidak boleh kosong",
      });
    }

    if (!description) {
      return res.json({
        message: "Ringkasan Kasus tidak boleh kosong",
      });
    }

    if (!category) {
      return res.json({
        message: "Kategori tidak boleh kosong",
      });
    }

    try {
      const newCases = new Cases({
        title,
        description,
        category,
        message,
        createdBy: userId,
        created: new Date(),
        isApproved: "Submitted",
        journalID,
      });
      await newCases.save();
      res.status(201).json({
        message: "Berhasil Upload",
        data: {
          title,
          description,
          category,
          message,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "Gagal upload Pengajuan Kasus",
      });
    }
  },

  addCasesDraft: async (req, res) => {
    const { userId } = req.user;
    const { title, description, category, message, journalID } = req.body;

    if (!title) {
      return res.json({
        message: "Judul Kasus tidak boleh kosong",
      });
    }

    if (!description) {
      return res.json({
        message: "Ringkasan Kasus tidak boleh kosong",
      });
    }

    if (!category) {
      return res.json({
        message: "Kategori tidak boleh kosong",
      });
    }

    try {
      const newCases = new Cases({
        title,
        description,
        category,
        message,
        createdBy: userId,
        created: new Date(),
        isApproved: "Draft",
        journalID,
      });
      await newCases.save();
      res.status(201).json({
        message: "Berhasil Upload",
        data: {
          title,
          description,
          category,
          message,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "Gagal upload Pengajuan Kasus",
      });
    }
  },

  editCases: async (req, res) => {
    const { id } = req.params; 
    const { userId } = req.user;
    const { title, description, category, message } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Judul Kasus tidak boleh kosong",
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "Ringkasan Kasus tidak boleh kosong",
      });
    }

    if (!category) {
      return res.status(400).json({
        message: "Kategori tidak boleh kosong",
      });
    }

    try {
      const status = await Cases.findById(id); 

      if (!status) {
        return res.status(404).json({
          message: "Kasus tidak ditemukan",
        });
      }

      if (status.isApproved === "Approved") {
        return res.status(403).json({
          message: "Tidak bisa melakukan update karena sudah diapproved",
        });
      }

      const updatedData = await Cases.findOneAndUpdate(
        { _id: id },
        {
          title,
          description,
          category,
          message,
          createdBy: userId,
        },
        { new: true } 
      );

      if (updatedData) {
        return res.status(200).json({
          message: "Berhasil Update",
          data: updatedData,
        });
      } else {
        return res.status(404).json({
          message: "Kasus tidak ditemukan untuk diperbarui",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Gagal update Pengajuan Kasus",
        error: error.message,
      });
    }
  },

  deletedCases: async (req, res) => {
    const { _id } = req.body;
    // const { userId } = req.user;

    const deleteByID = await Cases.deleteOne({ _id });

    try {
      if (deleteByID) {
        res.status(200).json({
          message: "berhasil dihapus",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "gagal",
      });
    }
  },
};
