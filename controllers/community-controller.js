const Cases = require("../models/Cases");
const Commentar = require("../models/Commentar");
const Category = require("../models/Category");

const Support = require("../models/Support");

module.exports = {
  getCommunity: async (req, res) => {
    try {
      const CategoryName = req.query.category
        ? decodeURIComponent(req.query.category)
        : "";
      const currentPage = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 6;

      // Filter berdasarkan status isApproved
      let filter = { isApproved: "Approved" };
      let categoryId;

      // Jika ada kategori, filter berdasarkan kategori
      if (CategoryName) {
        const category = await Category.findOne({ name: CategoryName });
        if (category) {
          categoryId = category._id;
          filter.category = categoryId;
        } else {
          return res.status(404).json({
            message: "Kategori tidak ditemukan",
          });
        }
      }

      // Parallel query untuk count dan data
      const [totalData, data] = await Promise.all([
        Cases.find(filter).countDocuments(),
        Cases.find(filter)
          .sort({ approved: "desc" })
          .populate("category", "name")
          .populate("createdBy", "avatar")
          .skip((currentPage - 1) * perPage)
          .limit(perPage)
          .lean(),
      ]);

      const totalPages = Math.ceil(totalData / perPage);

      // Jika ada data, kirimkan response sukses
      if (data && data.length > 0) {
        return res.status(200).json({
          message: "Berhasil Menampilkan Data",
          data,
          pagination: {
            total_data: totalData,
            per_page: perPage,
            current_page: currentPage,
            total_pages: totalPages,
          },
        });
      } else {
        return res.status(404).json({
          message: "Data tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({
        message: "Gagal menampilkan data",
      });
    }
  },

  getCommunityById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Cases.find({ _id: id, isApproved: "Approved" })
        .populate("category", "name")
        .populate("createdBy", "avatar")
        .lean();

      if (data && data.length > 0) {
        return res.status(200).json({
          message: "Berhasil Menampilkan Data",
          data,
        });
      } else {
        return res.status(404).json({
          message: "Data tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({
        message: "Gagal menampilkan data",
      });
    }
  },

  addCommentar: async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;
      const { userId } = req.user;

      // Validasi input
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }

      const newCommentar = new Commentar({
        created: new Date(),
        description,
        createdBy: userId,
        casesID: id,
      });

      await newCommentar.save();

      const addComment = await Cases.findOneAndUpdate(
        { _id: id },
        {
          $inc: { commentCounter: 1 },
        },
        { new: true }
      );

      if (addComment) {
        return res.status(201).json({
          message: "Berhasil Memberikan Dukungan",
          commentCounter: addComment.commentCounter,
        });
      }
    } catch (error) {
      console.error("Error creating commentar:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getCommentar: async (req, res) => {
    try {
      const { id } = req.params;
      const currentPage = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 10;

      // Hitung total komentar yang ada
      const totalData = await Commentar.countDocuments({ casesID: id });

      const commentar = await Commentar.find({ casesID: id })
        .populate("createdBy", "fullName avatar")
        .sort({ created: "desc" })
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .lean(); // Menghindari Mongoose overhead

      // Menghitung total halaman berdasarkan total data dan perPage
      const totalPages = Math.ceil(totalData / perPage);

      // Jika ada komentar, kembalikan response dengan data pagination
      if (commentar && commentar.length > 0) {
        return res.status(200).json({
          message: "Berhasil menampilkan komentar",
          commentar,
          pagination: {
            total_data: totalData,
            per_page: perPage,
            current_page: currentPage,
            total_pages: totalPages,
          },
        });
      } else {
        return res.status(400).json({
          message: "Data tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({
        message: "Gagal menampilkan komentar",
      });
    }
  },

  deleteCommentar: async (req, res) => {
    try {
      const { _id } = req.body;
      const { userId } = req.user; // id komentar yang akan dihapus
      const { casesID } = req.params; // casesID dari parameter URL

      // Menghapus komentar berdasarkan id
      const deleteComment = await Commentar.deleteOne({
        _id,
        createdBy: userId,
        casesID: casesID,
      });

      if (deleteComment.deletedCount === 0) {
        return res.status(404).json({
          message: "Komentar tidak ditemukan atau sudah dihapus.",
        });
      }

      // Mengupdate counter komentar di Cases
      const updateComment = await Cases.findOneAndUpdate(
        { _id: casesID },
        {
          $inc: { commentCounter: -1 }, // Mengurangi jumlah komentar
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Berhasil menghapus komentar",
        commentCounter: updateComment.commentCounter,
      });
    } catch (error) {
      console.error("Error creating support:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getSupport: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      const data = await Support.find({
        casesID: id,
        createdBy: userId,
      }).lean();
      if (!data || data.length === 0) {
        return res.status(404).json({
          message: "Data tidak ditemukan",
          data: [],
        });
      }

      res.json({
        message: "Berhasil mendapatkan data",
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data",
        error: error.message,
      });
    }
  },

  //ini buat di halaman detail komunitas
  addSupportById: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const { count } = req.body;

      const newSupport = new Support({
        casesID: id,
        createdBy: userId,
        created: new Date(),
        count,
      });
      await newSupport.save();

      const addSupport = await Cases.findOneAndUpdate(
        { _id: id },
        {
          $inc: { supportCounter: 1 },
        },
        { new: true }
      );

      if (addSupport) {
        return res.status(201).json({
          message: "Berhasil Memberikan Dukungan",
          data: {
            casesID: id,
            createdBy: userId,
            created: new Date(),
            count,
          },
          supportCounter: addSupport.supportCounter,
        });
      } else {
        return res.status(400).json({
          message: "Gagal",
        });
      }
    } catch (error) {
      console.error("Error creating support:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  //ini dari halaman beranda komunitas
  addSupport: async (req, res) => {
    try {
      const { userId } = req.user;
      const { count, id } = req.body;

      const checkSupport = await Support.findOne({ createdBy: userId });
      if (checkSupport) {
        return res.json({
          message: "Anda sudah memberikan dukungan",
        });
      }
      const newSupport = new Support({
        casesID: id,
        createdBy: userId,
        created: new Date(),
        count,
      });
      await newSupport.save();

      const dataSupport = await Support.find().countDocuments();

      const addSupport = await Cases.findOneAndUpdate(
        { _id: newSupport.casesID },
        {
          supportCounter: dataSupport,
        },
        { new: true }
      );

      if (addSupport) {
        return res.status(201).json({
          message: "Berhasil Memberikan Dukungan",
          data: {
            casesID: newSupport.casesID,
            createdBy: userId,
            created: new Date(),
            count,
          },
          supportCounter: addSupport.supportCounter,
        });
      } else {
        return res.status(400).json({
          message: "Gagal",
        });
      }
    } catch (error) {
      console.error("Error creating support:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteSupport: async (req, res) => {
    try {
      const { userId } = req.user;
      const { id } = req.body;

      const deleteSupport = await Support.deleteOne({
        casesID: id,
        createdBy: userId,
      });

      if (deleteSupport.deletedCount === 0) {
        return res.status(404).json({
          message: "Dukungan tidak ditemukan atau sudah dihapus.",
        });
      }

      const dataSupport = await Support.countDocuments();

      const updateSupport = await Cases.findOneAndUpdate(
        { _id: id },
        {
          supportCounter: dataSupport,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Berhasil menghapus Dukungan",
        supportCounter: updateSupport.supportCounter,
      });
    } catch (error) {
      console.error("Error deleting support:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteSupportById: async (req, res) => {
    try {
      const { userId } = req.user;
      const { id } = req.params;

      const deleteSupport = await Support.deleteOne({
        casesID: id,
        createdBy: userId,
      });

      if (deleteSupport.deletedCount === 0) {
        return res.status(404).json({
          message: "Dukungan tidak ditemukan atau sudah dihapus.",
        });
      }

      const updateSupport = await Cases.findOneAndUpdate(
        { _id: id },
        {
          $inc: { supportCounter: -1 },
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Berhasil menghapus Dukungan",
        supportCounter: updateSupport.supportCounter,
      });
    } catch (error) {
      console.error("Error deleting support:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
