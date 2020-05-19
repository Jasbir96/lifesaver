const userRouter = require("express").Router();
const { signup, login, protectRoute, isAuthorized, forgetPassword, resetPassword } = require("../controller/authController");
const { getUser, getAllUser, updateProfileImage, deleteUser } = require("../controller/userController");
const multer = require("multer");
// single file upload
// const sharp = require("sharp");
// const fs = require("fs");
// ///////////////////////////JSON
// const {
//   getAllUser,
//   getUser,
//   updateUser,
//   deleteUser
// } = require("../controller/userController");
// const {checkId} = require("../utility/utilityfn");
// userRouter
//   .route("")
//   .get(getAllUser)
//   .post(checkbody, createUser);

// userRouter
//   .route("/:id")
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);
// /////////////////////DB//////////////////////

const filter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true)
  } else {
    cb(new Error("Not an Image! Please upload an image"), false)
  }
}
//storageFilter => file=> jpg,destination

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/users/");
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}.jpeg`)
  }
})
// ram

const upload = multer({
  storage: multerStorage,
  fileFilter: filter
})
//  mutipart data=> everything=> image  , naming , extension => put 
userRouter.patch("/ProfileImage", upload.single("photo"), protectRoute, updateProfileImage);

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.patch("/forgetPassword",  forgetPassword)
userRouter.patch("/resetPassword/:token",resetPassword)
// profile page 
userRouter.use(protectRoute)
userRouter.get("/userProfile", getUser);
// isAuthorized
// admin
userRouter.use(isAuthorized(["admin"]));
userRouter.route("").get(getAllUser);
userRouter
  .route("/:id")
  .delete(deleteUser);
module.exports = userRouter;
