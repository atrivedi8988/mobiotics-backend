const User = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { thrownErrorMessage } = require("../Middlewares/responseMessage");
const crypto = require("crypto");
const { strongPassword } = require("../Middlewares/extrafunctionalityProblem");
const generateToken = require("../config/generateToken");
const { sendEmail } = require("../Middlewares/sendEmail");

// Register New User

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (strongPassword(password) === true) {
      if (password === confirmPassword) {
        const user = await User.create({
          name,
          email,
          password,
          confirmPassword,
        });
        const token = generateToken(user._id);
        res.status(201).json({
          success: true,
          message: "User signup successfully",
          token,
        });
      } else {
        return thrownErrorMessage(
          res,
          400,
          "Password and Confirm Password does not match"
        );
      }
    } else {
      return thrownErrorMessage(res, 400, strongPassword(password));
    }
  } catch (error) {
    return thrownErrorMessage(res, 500, error.message);
  }
};

// Login a User

exports.loggedInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        token,
      });
    } else {
      return thrownErrorMessage(res, 404, "user not found. With this Email id");
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
    // return thrownErrorMessage(res,500,error)
  }
};

// Get Profile Authenticate User

exports.getProfileAuthenticateUser = async (req, res) => {
  // console.log(req.user)
  res.status(200).send(req.user);
};

// Get All User --- Admin authorize

exports.getAllUserByAdmin = async (req, res) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    user,
  });
};

// Make Admin Any user

exports.makeAdmin = async (req, res) => {
  const { id } = req.params;
  let user = await User.findById(id);
  if (!user) {
    return thrownErrorMessage(res, 404, "User not found");
  }
  user = await User.findByIdAndUpdate(id, { role: req.body.role });
  // user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message : "successfully assigned",
    user,
  });
};

// Forgot Password

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = crypto.randomBytes(20).toString("hex");
      // // token = crypto.createHash("sha256").update(token).digest("hex");

      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      user.resetPasswordTokenExpiry = (Date.now() + 15 * 60 * 1000).toString();

      await user.save();

      const link = `http://localhost:3000/reset/${user._id}/${user.resetPasswordToken}`;

      // console.log(token)
      // console.log(link)
      // console.log(user)
      try {
        await sendEmail({ email, link });

        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email} successfully`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return thrownErrorMessage(res, 500, "Server Error");
      }
    } else {
      return thrownErrorMessage(res, 404, "User not found from this email");
    }
  } catch (error) {
    return thrownErrorMessage(res, 500, "myServer Error");
  }
};

// Reset Password

exports.resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;
  
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return thrownErrorMessage(
        res,
        400,
        "Reset Password token is invalid or has been expired"
      );
    }

    if(password==user.password){
      return thrownErrorMessage(res,400,"New and old password same")
    }
  
    if (password !== confirmPassword) {
      return thrownErrorMessage(res, 400, "Password does not match");
    }
    console.log(strongPassword(password));
    if (strongPassword(password) === true) {
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Password chaged successfully",
      });
    } else {
      return thrownErrorMessage(res, 400, strongPassword(password));
    }
  
  } catch (error) {
    return thrownErrorMessage(res,500,error.message)
  }
 
  // sendToken(user, 200, res);

  // if (token && id) {
  //   // console.log(crypto.createHash("sha256").update(token).digest("hex"));
  //   // console.log(id);
  //   // console.log(await User.findById(id))
  //   const user = await User.findOne({ resetPasswordToken: token });
  //   // const user = await User.findById(id)
  //   // console.log(user)
  //   if (user) {
  //     if (user.resetPasswordTokenExpiry > Date.now()) {
  //       if (strongPassword(password) === true) {
  //         if (password === confirmPassword) {
  //           await User.findByIdAndUpdate(user._id, {
  //             $set: { password },
  //           });
  //           user.resetPasswordToken = undefined;
  //           user.resetPasswordTokenExpiry = undefined;

  //           await user.save();
  //           res.status(200).json({
  //             success: true,
  //             message: "Password changed successfully",
  //           });
  //         } else {
  //           return thrownErrorMessage(
  //             res,
  //             400,
  //             "Password and Confirm Password does not match"
  //           );
  //         }
  //       } else {
  //         return thrownErrorMessage(res, 400, strongPassword(password));
  //       }
  //     } else {
  //       return thrownErrorMessage(res, 500, "token is Expired");
  //     }
  //   } else {
  //     return thrownErrorMessage(res, 404, "User not found. Invalid Link");
  //   }
  // } else {
  //   return thrownErrorMessage(res, 400, "Invalid Link");
  // }
};
