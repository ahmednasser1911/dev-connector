const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require("express-validator");
const User = require('../../models/User');

// @route   /api/auth
// @desc    get logged user
// @access  Public

router.get("/", auth, async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");
    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error!");
  }
});



// @route   Post /api/auth
// @desc    Login user
// @access  Public

router.post(
  "/",
  [
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password must be more than 6 chars").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials!" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials!" }] });
      }

      const payload = {
          user: {
            id: user.id
          }
      }

      jwt.sign(payload , config.get('jwtSecret') , { expiresIn: 360000 } , (err , token) => {
          if(err) throw err;
          res.json({ token });
      })

    } catch (err) {
      console.error(err.message);
      res.status(500);
    }
  }
);


module.exports = router;