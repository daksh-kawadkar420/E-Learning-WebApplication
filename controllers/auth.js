const User = require("../models/user.js");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors =
    validationResult(req); /**It simply used for server side data validations */

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to save data in DB.",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne(
    {
      email,
    },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User email does not exist",
        });
      }
      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: "email or password does not match",
        });
      }
      // CREATE A TOKEN
      var token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.SECRET
      );

      // PUT TOKEN IN COOKIE
      res.cookie("token", token, {
        expire: new Date() + 9999,
      });
      // console.log(token);
      // SEND RESPONSE TO FRONT END
      const { _id, name, email, role } = user;
      return res.json({
        token,
        user: {
          _id,
          name,
          email,
          role,
        },
      });
    }
  );
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user sign out sucessfully",
  });
};

// PROTECTED ROUTES

exports.isSignedin = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

// COSTUM MIDDLEWARES

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "ACCESS DENIED, you are not an ADMIN.",
    });
  }
  next();
};
