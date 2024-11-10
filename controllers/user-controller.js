const User = require("../models/User")

module.exports = { 
    getAllUser: async (req, res) => {
        const data = await User.find({})

        res.json({
            message: "Berhasil mendapatkan semua User",
            data
        })
    },
    addUser: (req, res) => {
        const data = req.body

        //check if file uploaded
        if(req.file){
            console.log("File uploaded: ", req.file)
            data.avatar = `/userID-assets/${req.file.filename}` //rename jadi data.avatar
        }else{
            console.log("No file uploaded")
        }

        const newUser = new User(data)
        newUser.save()
        .then((savedUser) => {
            res.json({
            message: "User berhasil dibuat",
            savedUser
            })
        })
        .catch((e) => {
            console.log("Error saving user data", e)
            res.json({
                message: "Gagal membuat user"
            })
        })
        
    },
    editUser: async (req, res) => {
        const { id } = req.params

        // const editUser = await User.findByIdAndUpdate(id, req.body)
        // editUser.save()

        const editData =  {
            ...req.body,
            edited: new Date() //auto set edit date
        }

        if(req.file){
            console.log("File uploaded: ", req.file)
            editData.file = `/userID-assets/${req.file.filename}`
        }

        const updatedUser = await User.findByIdAndUpdate(id, editData, { new: true })
        res.json({
            message: "Berhasil mengupdate user",
            updatedUser
        })
    },
    deleteUser: async (req, res) => {
        const { id } = req.params

        await User.findByIdAndDelete(id)

        res.json({
            message: "berhasil hapus user"
        })
    },
    getUserById: async (req, res) => {
        const { id } = req.params

        const findUserbyId = await User.findById(id)

        res.json({
            message: "berhasil mendapatkan user by id",
            findUserbyId
        })
    },
    editUserProfile: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }

            const updatedData = {
                fullName: req.body.fullName || user.fullName,
                edited: new Date(),
            };

            if (req.file) {
                console.log("File uploaded: ", req.file);
                updatedData.avatar = `/userID-assets/${req.file.filename}`;
            }

            const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
            res.json({
                message: "Berhasil mengupdate profil",
                updatedUser,
            });
        } catch (error) {
            console.error("Error updating user profile:", error);
            res.status(500).json({
                message: "Gagal mengupdate profil",
                error: error.message,
            });
        }
    },
    getAllUsersPagination: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query; 

            const skip = (page - 1) * limit;

            const users = await User.find().skip(skip).limit(limit);
            const totalUsers = await User.countDocuments(); 

            const totalPages = Math.ceil(totalUsers / limit);

            res.json({
                message: "Berhasil mendapatkan daftar pengguna",
                data: users,
                pagination: {
                    totalUsers,
                    totalPages,
                    currentPage: Number(page),
                    limit: Number(limit)
                }
            });
        } catch (error) {
            console.error("Error fetching users with pagination:", error);
            res.status(500).json({
                message: "Gagal mendapatkan pengguna",
                error: error.message,
            });
        }
    }
}
