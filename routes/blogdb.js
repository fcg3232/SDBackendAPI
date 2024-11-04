// Import necessary modules and models
const { Blog } = require("../models/blog");
const express = require("express");
const router = express.Router();

// CREATE POST
router.post("/", async (req, res) => {
  try {
    // Create a new blog post with the data from the request body
    const newPost = new Blog(req.body);
    // Save the new post to the database
    const savedPost = await newPost.save();
    // Send the saved post as the response
    res.status(200).send(savedPost);
  } catch (err) {
    // Send an error response if something goes wrong
    res.status(500).json(err);
  }
});

// UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    // Find the post by ID
    const post = await Blog.findById(req.params.id);
    // Check if the post belongs to the user making the request
    if (post.name === req.body.name) {
      try {
        // Update the post with the new data from the request body
        const updatedPost = await Blog.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        // Send the updated post as the response
        res.status(200).json(updatedPost);
      } catch (err) {
        // Send an error response if something goes wrong
        res.status(500).json(err);
      }
    } else {
      // Send a forbidden response if the user is not authorized to update the post
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    // Send an error response if something goes wrong
    res.status(500).json(err);
  }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    // Find the post by ID
    const post = await Blog.findById(req.params.id);
    // Check if the post belongs to the user making the request
    if (post.name === req.body.name) {
      try {
        // Delete the post from the database
        await post.delete();
        // Send a success response
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        // Send an error response if something goes wrong
        res.status(500).json(err);
      }
    } else {
      // Send a forbidden response if the user is not authorized to delete the post
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    // Send an error response if something goes wrong
    res.status(500).json(err);
  }
});

// GET POST
router.get("/:id", async (req, res) => {
  try {
    // Find the post by ID
    const post = await Blog.findById(req.params.id);
    // Send the post as the response
    res.status(200).json(post);
  } catch (err) {
    // Send an error response if something goes wrong
    res.status(500).json(err);
  }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    // If a username is provided, find posts by that user
    if (username) {
      posts = await Blog.find({ username });
    // If a category name is provided, find posts in that category
    } else if (catName) {
      posts = await Blog.find({
        categories: { $in: [catName] },
      });
    // If no query parameters are provided, find all posts
    } else {
      posts = await Blog.find();
    }
    // Send the posts as the response
    res.status(200).json(posts);
  } catch (err) {
    // Send an error response if something goes wrong
    res.status(500).json(err);
  }
});

// Export the router to be used in other parts of the application
module.exports = router;