const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");
// @route   Get /api/profile/me
// @desc    get users profile
// @access  Private

router.get("/me", auth, async (req, res) => {
  try {
    var profile = await Profile.findOne({
      user: req.user.id
    }).populate('user' , ['name' , 'avatar'])

    if (!profile) {
      return res.status(400).json({ msg: "No profile for this user!" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post /api/profile/
// @desc    create and update profile
// @access  Private

router.post(
  "/",
  [
    auth,
    check("status", "Status Required!")
      .not()
      .isEmpty(),
    check("skills", "Skills Required!")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instgram,
      linkedin
    } = req.body;

    // Build profile object
    const profileFileds = {};
    profileFileds.user = req.user.id; // from token
    if (company) profileFileds.company = company;
    if (website) profileFileds.website = website;
    if (location) profileFileds.location = location;
    if (bio) profileFileds.bio = bio;
    if (status) profileFileds.status = status;
    if (githubusername) profileFileds.githubusername = githubusername;
    if (skills) {
      profileFileds.skills = skills.split(",").map(skill => skill.trim());
    }

    // Biuld social object
    profileFileds.social = {};
    if (youtube) profileFileds.social.youtube = youtube;
    if (facebook) profileFileds.social.facebook = facebook;
    if (linkedin) profileFileds.social.linkedin = linkedin;
    if (twitter) profileFileds.social.twitter = twitter;
    if (instgram) profileFileds.social.instgram = instgram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // Update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFileds },
          { new: true, useFindAndModify: false }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFileds);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   Get /api/profile
// @desc    get all profiles
// @access  public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user' , ['name' , 'avatar']);
    
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Get /api/profile/user/:user_id
// @desc    get user profile by id
// @access  public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found!" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId")
      return res.status(400).json({ msg: "Profile not found!" });
    res.status(500).send("Server Error");
  }
});

// @route   Delete api/profile
// @desc    delete user profile and post
// @access  private

router.delete("/", auth, async (req, res) => {
  try {
    // Remove posts
    await Post.deleteMany({user: req.user.id})
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User Deleted!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Put api/profile/experience
// @desc    Put user experience
// @access  private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title required!")
        .not()
        .isEmpty(),
      check("company", "Company required!")
        .not()
        .isEmpty(),
      check("from", "From date required!")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      describtion
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      describtion
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

// @route   Delete /api/experience/:exp_id
// @desc    delete experience
// @access  private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Get index to remove
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Put api/profile/education
// @desc    Put user education
// @access  private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School required!")
        .not()
        .isEmpty(),
      check("degree", "Degree required!")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of Study required!")
        .not()
        .isEmpty(),
      check("from", "From date required!")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      describtion
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      describtion
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

// @route   Delete /api/education/:edu_id
// @desc    delete education
// @access  private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // Get index to remove
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Get /api/profile/github/:username
  // @desc    get user github repo
// @access  Public

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&
      client_id=${config.get("githubClientID")}&client_secret=${config.get(
        "githubSecret"
      )}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200)
        return res.status(404).json({ msg: "No githib profile found!" });

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error!')
    
  }
});

module.exports = router;
