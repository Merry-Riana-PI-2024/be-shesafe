const express = require("express")
const route = express.Router()
const { getAllUser, getUserById, addUser, deleteUser, editUser, editUserProfile, getAllUsersPagination } = require("../controllers/user-controller")
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "userID-assets")
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname) //buat generate unique file name
        cb(null, uniqueName)
    }
})

//filter file type
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|pdf/
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedFileTypes.test(file.mimetype)

    if(mimetype && extname) {
        cb(null, true)
    }else{
        cb(new Error("Only image and pdf files are allowed"))
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } //limit 10MB
})


route.get("/", getAllUser) //get User
route.get("/:id", getUserById) //get User by id
route.post("/", upload.single("file"), addUser) //add User
route.put("/:id", upload.single("file"), editUser) //edit user
route.get("/page", getAllUsersPagination) //get All User Pagination
route.get("/:id", getUserById) //get User by id
route.post("/", upload.single("file"), addUser) //add User
route.put("/:id", upload.single("file"), editUser) //edit user
route.put("/profile/:id", upload.single("file"), editUserProfile ) //edit profile user
route.delete("/:id", deleteUser) //delete by id

module.exports = route