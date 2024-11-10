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
    const { id } = req.params;
    const editData = {
      ...req.body,
      edited: new Date(),
    };

    try {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: id },
        { ...editData },
        { new: true }
      );

      return res.json({
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
      return res
        .status(500)
        .json({ message: "Gagal mengupdate user", error: error.message });
    }
  },
};
