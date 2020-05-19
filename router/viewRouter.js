const viewRouter = require("express").Router();
const {   getHomePage, getPlansPage, getLoginPage, getProfilePage ,getSignupPage,getForgetPasswordPage,getResetPage,getSomethingWentWrong} = require("../controller/viewController");
const { handleResetRequest,isUserLoggedIn, protectRoute, logout } = require("../controller/authController");
// req.cookies=> jwt => name 
//  /plans => isUserLoggedIN
viewRouter.use(isUserLoggedIn);
viewRouter.get("/", getHomePage);
viewRouter.get("/signup",getSignupPage)
viewRouter.get("/logout", logout);
viewRouter.get("/plans", getPlansPage);
viewRouter.get("/login", getLoginPage);
viewRouter.get("/profile", protectRoute, getProfilePage);
viewRouter.get("/forgetPassword",getForgetPasswordPage); 
viewRouter.get("/resetPassword/:token", handleResetRequest,getResetPage)
viewRouter.get("/somethingWentWrong", getSomethingWentWrong);
module.exports = viewRouter;