const JWT_SECRET = process.env.JWT_SECRET || require("../config/secrets").JWT_SECRET;
// db 
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const emailHelper = require("../utility/sendEmail");
async function signup(req, res) {
  try {
    const newUser = await userModel.create(req.body);
    //  welcome mail
    // send Mail
    let html = `<h1>Welcome ${newUser.name} to our Family </h1>
      `;
    let subject = "Get Going With life savers";
    let options = {
      to: newUser.email,
      html,
      subject: subject
    }
    await emailHelper(options);
    res.status(201).json({
      status: "user Signedup",
      newUser,
    });
  } catch (err) {
    res.status(200).json({
      status: "user can't be created",
      err,
    });
  }
}
// token create
// payload => user id
async function login(req, res) {
  try {
    if (req.body.email && req.body.password) {
      // find user
      const user = await userModel.findOne({ email: req.body.email }).select("+password");
      if (user) {
        // console.log(user);
        if (user.password == req.body.password) {
          const id = user["_id"];
          const token = jwt.sign({ id }, JWT_SECRET);
          // header
          res.cookie("jwt", token, { httpOnly: true });
          return res.status(200).json({
            status: "userLogged In", token
          });
        } else {
          throw new Error("email or password didn't match ");
        }
      } else {
        throw new Error("User not found");
      }
    }

    throw new Error("Invalid Input");
  } catch (err) {
    // console.log(err);
    return res.status(200).json({
      status: "user can't be loggedIn",
      err,
    });
  }
}

async function logout(req, res) {
  // token => loggedIN
  res.cookie("jwt", "wrongtoken", { httpOnly: true });
  res.status(200).json({
    status: "user LoggedOut"
  })
}
// It verifies
async function protectRoute(req, res, next) {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ").pop();
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt
    }
    // console.log(token)
    if (token) {
      const payload = jwt.verify(token, JWT_SECRET);
      if (payload) {
        // user id 
        // console.log(payload)
        const user = await userModel.findById(payload.id);
        req.role = user.role;
        req.id = payload.id
        next();
      } else {
        throw new Error("Token is modified please login again");
      }
    } else {
      throw new Error("Please login first");
    }
  } catch (err) {
    // console.log(err);
    // client postman => json reply
    // client browser => authorized page
    let clientType = req.get("User-Agent");
    // console.log(clientType);
    if (clientType.includes("Mozilla") == true) {
      //  backend express 
      return res.redirect("/login");
    }
    else {
      res.status(200).json({
        err: err.message,
      });
    }

  }
}
async function isUserLoggedIn(req, res, next) {
  try {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt
    }
    // console.log(token)
    if (token) {
      const payload = jwt.verify(token, JWT_SECRET);
      if (payload) {
        // user id 
        // console.log(payload)
        const user = await userModel.findById(payload.id);
        req.role = user.role;
        req.id = payload.id
        req.userName = user.name
        next();
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (err) {
    // console.log(err);
    next();
  }
}
function isAuthorized(roles) {
  return function (req, res, next) {
    if (roles.includes(req.role) == true) {
      next()
    } else {
      res.status(403).json({
        status: "user not allowed"
      })
    }
  }
}
async function forgetPassword(req, res) {
  let { email } = req.body;
  try {
    console.log(email);
    const user = await userModel.findOne({ email: email });
    if (user) {
      // create token
      const resetToken = user.createResetToken();
      // confirm password
      await user.save({ validateBeforeSave: false });
      let resetPasswordLink = `${req.protocol}://${req.get("host")}/resetPassword/${resetToken}`;
      // send Mail
      let html = `<h1>Please click on the link to reset your password </h1>
      <p>${resetPasswordLink}</p>
      `;
      let subject = "Reset Token Email";
      let options = {
        to: user.email,
        html,
        subject: subject
      }
      await emailHelper(options);
      res.status(200).json({
        resetPasswordLink,
        resetToken,
        status: "Token send to your email"
      })
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
      status: "cannot reset password"
    }
    )
  }
}
async function handleResetRequest(req, res, next) {
  try {
    const { token } = req.params;
    console.log(token);
    let user = await userModel.findOne({ resetToken: token });
    if (user) {

      req.token = token;
      console.log("220 " + req.token)
      // console.log("I was inside");
      next();

      // token verify 
    } else {
      res.redirect("/somethingWentWrong");
    }

  } catch (err) {
    res.redirect("/somethingWentWrong");
  }
}
async function resetPassword(req, res) {
  try {
    const token = req.params.token
    const { password, confirmPassword } = req.body;
    console.log("218 " + token);
    const user = await userModel.findOne({
      resetToken: token
    })
    if (user) {
      user.resetPasswordhandler(password, confirmPassword)
      // db save 
      console.log(200 + "" + password + " " + confirmPassword);
      await user.save();
      res.status(200).json({
        success: "user password updated login with new password"
      })

    } else {
      console.log("I was here");
      throw new Error("Not a valid token");
    }

  } catch (err) {
    console.log(err.message);
    res.status(200).json({
      status: "Some error occurred",
      err
    })
  }
}
module.exports.login = login;
module.exports.signup = signup;
module.exports.protectRoute = protectRoute;
module.exports.isAuthorized = isAuthorized;
module.exports.forgetPassword = forgetPassword
module.exports.resetPassword = resetPassword;
module.exports.logout = logout;
module.exports.isUserLoggedIn = isUserLoggedIn;
module.exports.handleResetRequest = handleResetRequest;
