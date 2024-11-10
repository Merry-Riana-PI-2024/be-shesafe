const Education = require("../models/Education");

module.exports = {
  addModule: async (req, res) => {
    const { adminId } = req.admin;
    const data = req.body;

    try {
      const fileUrl = req.file
        ? cloudinary.url(req.file.public_id, { secure: true })
        : null;

      const newModule = new Education({
        ...data,
        createdBy: adminId,
        file: fileUrl,
      });

      await newModule.save();
      res.status(201).json({
        message: "Berhasil menambahkan module",
        data: newModule,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal menambahkan module",
        error: error.message || error,
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
    const { id } = req.params;
    const data = req.body;

    try {
      const findModule = await Education.findById(id);

      if (!findModule) {
        return res.status(404).json({
          message: "Modul tidak ditemukan",
        });
      }

      if (data.file && req.file) {
        // Jika ada file baru yang diupload, update file di Cloudinary
        const fileUrl = cloudinary.url(req.file.public_id, { secure: true });
        data.file = fileUrl;
      }

      const updatedModule = await Education.findByIdAndUpdate(id, data, {
        new: true,
      });

      res.json({
        message: "Berhasil mengedit modul",
        updatedModule,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengedit modul",
        error: error.message || error,
      });
    }
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
