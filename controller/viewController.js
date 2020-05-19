const planModel = require("../model/planModel");
const userModel = require("../model/userModel");
function getTrialPage(req, res) {
  const name = req.userName;
  res.render("trial.pug", {
    titleofThePage: "Trial Page", name
  })
}

async function getHomePage(req, res) {
  let plans = await planModel.find().limit(3);
  let name = req.userName;
  res.render("home.pug", {
    title: "Home Page", plans, name: name
  })
}
// 
async function getPlansPage(req, res) {
  // planModel =>get  plans 
  let plans = await planModel.find();
  let name = req.userName;
  res.render("plansPage.pug", {
    title: "Plans Page", plans, name
  })
}
function getLoginPage(req, res) {
  // let name = req.userName;
  res.render("login.pug", {
    title: "Login"
  })
}
async function getProfilePage(req, res) {
  const user = await userModel.findById(req.id);
  const name = req.userName;
  res.render("profile.pug", {
    title: "Profile Page",
    user, name
  })
}
async function getSignupPage(req, res) {
  res.render("signupPage.pug", {
    title: "Signup Page"
  })
}
async function getForgetPasswordPage(req, res) {
  res.render("forgetPassword.pug", {
    title: "ForgetPassword",
  })
}
async function getResetPage(req, res) {
  const { token } = req;
  res.render("resetPassword", { token });

}
async function getSomethingWentWrong(req, res) {
  res.render("somethingWentWrong");
}
module.exports.getTrialPage = getTrialPage;
module.exports.getHomePage = getHomePage;
module.exports.getPlansPage = getPlansPage;
module.exports.getLoginPage = getLoginPage;
module.exports.getProfilePage = getProfilePage;
module.exports.getSignupPage = getSignupPage;
module.exports.getForgetPasswordPage = getForgetPasswordPage;
module.exports.getResetPage = getResetPage;
module.exports.getSomethingWentWrong = getSomethingWentWrong;
