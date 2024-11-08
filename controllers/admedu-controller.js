const Education = require("../models/Education");

module.exports = {
  addModule: async (req, res) => {
    const { adminID } = req.adminID;
    const data = req.body;
    try {
      const newModule = new Education(...data, {
        createdBy: adminID,
        file: req.file.path,
      });

      await newModule.save();
      res.status(201).json({
        message: "berhasil menambahkan module",
        data,
      });
    } catch (error) {
      res.json({
        message: "gagal",
      });
    }
  },

  getAllModule: async (req, res) => {
    const data = await Education.find({}).sort({ created: 1 }); //urutkan ascending berdasarkan created date

    res.json({
      message: "Berhasil mendapatkan semua Module",
      data,
    });
  },

  getEditModule: async (req, res) => {
    const { id } = req.body;

    const findModule = await Education.findById({ _id: id });

    res.json({
      message: "Berhasil mendapatkan detail module by",
      findModule,
    });
  },

  deleteModule: async (req, res) => {
    const { id } = req.body;
    try {
      const deleteModule = await Category.findByIdAndDelete({ _id: id });
      if (!deleteModule) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }
      res.json({
        message: "Data berhasil dihapus",
        data: deleteModule,
      });
    } catch (error) {
      res.status(500).json({
        message: "Terjadi kesalahan saat menghapus data",
        error: error.message,
      });
    }
  },
};
