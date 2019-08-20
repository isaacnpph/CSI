const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const Session = require("../../models/Session");

//  @route  POST api/users
//  @desc   Register user
//  @access public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // create user
      user = new User({
        name,
        email,
        password
      });

      // Ecrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // save new user to database
      await user.save();

      // get payload
      const payload = {
        user: {
          id: user.id
        }
      };

      // sign jsonwebtoken
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//  @route  PUT api/users/edit
//  @desc   Change personal details
//  @access Private
router.put(
  "/edit",
  [
    auth,
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail()
    // check(
    //   "password",
    //   "Please enter a password with 6 or more characters"
    // ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // const salt = await bcrypt.genSalt(10);
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            name: req.body.name,
            email: req.body.email
            // password: req.body.password
          }
        },
        { new: true }
      );
      // user.password = await bcrypt.hash(req.body.password, salt);
      return res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//  @route  GET api/users/me
//  @desc   Get current user profile
//  @access Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id).select("-password");
    if (!profile) {
      return res.status(400).json({ msg: "User not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//  @route  DELETE api/users/
//  @desc   Delete user
//  @access Private
router.delete("/", auth, async (req, res) => {
  try {
    // delete user's sessions
    await Session.deleteMany({ author: req.user.id });
    // delete user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
