const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.json({
        message: "Berhasil mendapatkan data User",
        data: {
          fullName: user.fullName,
          email: user.email,
          gender: user.gender,
          birthDate: user.birthDate,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error(error); // Untuk debugging
      res.status(500).json({ message: "Terjadi kesalahan pada server", error });
    }
  },

  editProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const editData = {
        ...req.body,
        edited: new Date(), // Auto-set edit date
      };

      // Jika ada file yang diunggah, tambahkan ke editData
      if (req.file) {
        console.log("File uploaded: ", req.file);
        // Sesuaikan jalur avatar sesuai kebutuhan (gunakan URL penuh jika file diunggah ke Cloudinary)
        editData.avatar = req.file.path; 
      }

      // Perbarui data user
      const updatedUser = await User.findByIdAndUpdate(id, editData, { new: true });

      // Jika user tidak ditemukan, kembalikan pesan error
      if (!updatedUser) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      // Jika berhasil, kembalikan data user yang diperbarui
      res.json({
        message: "Berhasil mengupdate user",
        data: {
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          gender: updatedUser.gender,
          birthDate: updatedUser.birthDate,
          avatar: updatedUser.avatar,
        },
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(400).json({ message: "Gagal mengupdate user", error: error.message });
    }
  },
};
