const Education = require("../models/Education")

module.exports = {
    getAllModule: async (req, res) => {
        const data = await Education.find({})
            .populate("createdBy")
            .sort({ created: 1 }) //urutkan ascending berdasarkan created date
            .limit(5) //limit 5

        res.json({
            message: "Berhasil mendapatkan semua Module",
            data
        })
    },
    getDetailModule: async (req, res) => {
        const { id } = req.params

        const findModule = await Education.findById(id)

        res.json({
            message: "Berhasil mendapatkan detail module by",
            findModule
        })
    }
}