var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");

const { signout, signup, signin, isSignedin } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "Name should be atleast 3 letters").isLength({
      min: 3,
    }),
    check("email", "Email is mandatory").isEmail(),
    check("password", "Password should be atleast 3 letters").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "Email is mandatory.").isEmail(),
    check("password", "Password is mandatory.").isLength({
      min: 3,
    }),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
