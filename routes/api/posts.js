const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

// @route   Post api/posts
// @desc    Create Post
// @access  Private

router.post(
  "/",
  [
    auth,
    [
      check("text", "Text Required!")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, avatar } = await User.findById(req.user.id);

      const newPost = new Post({
        text: req.body.text,
        name,
        avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Server Error!");
    }
  }
);

// @route   Get api/posts
// @desc    Get all Post
// @access  Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error!");
  }
});

// @route   Get api/posts/:id
// @desc    Get Post by id
// @access  Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({ msg: "Post not found!" });
    }
    res.json(post);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found!" });

    console.error(err.message);
    res.status(500).json("Server Error!");
  }
});

// @route   Delete api/posts:id
// @desc    Delete Post
// @access  Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });

    if (!post) return res.status(404).json({ msg: "Post not found!" });

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized!" });

    await post.remove();
    res.json({ msg: "Post Removed!" });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found!" });
    console.error(err.message);
    res.status(500).json("Server Error!");
  }
});

// @route   Put api/posts/like/:id
// @desc    Put like
// @access  Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    // Check if auth user likes this post before
    const likeArr = post.likes.filter(like => {
      return like.user.toString() === req.user.id;
    });
    if (likeArr.length > 0)
      return res.status(400).json({ msg: "Post already liked!" });

    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error!");
  }
});

// @route   Put api/posts/unlike/:id
// @desc    dislike
// @access  Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    // Check if auth user likes this post before
    const likeArr = post.likes.filter(like => {
      return like.user.toString() === req.user.id;
    });
    // post not liked yet
    if (likeArr.length === 0)
      return res.status(400).json({ msg: "Post has't been liked!" });

    const likedUsers = post.likes.map(like => like.user.toString());
    const removeIndex = likedUsers.indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error!");
  }
});

// @route   Post api/posts/comment/:id
// @desc    Comment on a post
// @access  Private

router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text Required!")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, avatar } = await User.findById(req.user.id);
      const post = await Post.findById(req.params.id);

      const comment = {
        text: req.body.text,
        name,
        avatar,
        user: req.user.id
      };

      post.comments.unshift(comment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Server Error!");
    }
  }
);
module.exports = router;

// @route   Delete api/posts/comment/:id/:comment_id
// @desc    Delete Comment on a post
// @access  Private

router.delete('/comment/:id/:comment_id' , auth, async (req , res) => {
    try {
        const post = await Post.findById(req.params.id);
        // Getting the comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        // Check comment
        if(!comment)
            return res.status(404).json({msg: 'No comment found!'});
        // Check user 
        if(comment.user.toString() !== req.user.id)
            return res.status(401).json({msg: 'User not authorized!'});
        
        // get arr of users who comments on the post
        const commentedUsers = post.comments.map(comment => comment.user.toString());
        // get comment of authrized user
        const removeIndex = commentedUsers.indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);

        await post.save();
        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error!");
    }
})
