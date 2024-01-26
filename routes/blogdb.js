// const {Blog} = require("../models/blog");
// const { auth, isUser, isAdmin } = require("../middleware/auth");
// const cloudinary = require("../utils/cloudinary");

// const router = require("express").Router();

// //CREATE

// router.post("/", async (req, res) => {
//   const {title,desc,image, name,categories } = req.body;

//   try {
//     if (image) {
//       const uploadedResponse = await cloudinary.uploader.upload(image, {
//         upload_preset: "almonivepk",
//       });

//       if (uploadedResponse) {
//         const blog = new Blog({
//           title,
//           desc,
//           image: uploadedResponse,
//           name,
//           categories,
        
//         });

//         const savedBlog = await blog.save();
//         res.status(200).send(savedBlog);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });

// //DELETE

// router.delete("/:id", isAdmin, async (req, res) => {
//   try {
//     const product = await Blog.findById(req.params.id);

//     if (!product) return res.status(404).send("Product not found...");

//     if (product.image.public_id) {
//       const destroyResponse = await cloudinary.uploader.destroy(
//         product.image.public_id
//       );

//       if (destroyResponse) {
//         const deletedProduct = await Blog.findByIdAndDelete(req.params.id);

//         res.status(200).send(deletedProduct);
//       }
//     } else {
//       console.log("Action terminated. Failed to deleted product image...");
//     }
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // EDIT PRODUCT

// router.put("/:id", async (req, res) => {
//   if (req.body.blogImg) {
//     const destroyResponse = await cloudinary.uploader.destroy(
//       req.body.blog.image.public_id
//     );

//     if (destroyResponse) {
//       const uploadedResponse = await cloudinary.uploader.upload(
//         req.body.blogImg,
//         {
//           upload_preset: "almonivepk",
//         }
//       );

//       if (uploadedResponse) {
//         const updatedProduct = await Blog.findByIdAndUpdate(
//           req.params.id,
//           {
//             $set: {
//               ...req.body.blog,
//               image: uploadedResponse,
//             },
//           },
//           { new: true }
//         );

//         res.status(200).send(updatedProduct);
//       }
//     }
//   } else {
//     try {
//       const updatedProduct = await Blog.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: req.body.blog,
//         },
//         { new: true }
//       );
//       res.status(200).send(updatedProduct);
//     } catch (err) {
//       res.status(500).send(err);
//     }
//   }
// });

// //GET ALL PRODUCTS

// router.get("/", async (req, res) => {
//   const qlocation = req.query.location;
//   try {
//     let products;

//     if (qlocation) {
//       products = await Blog.find({
//         location: qlocation,
//       }).sort({ _id: -1 });
//     } else {
//       products = await Blog.find().sort({ _id: -1 });
//     }

//     res.status(200).send(products);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// //GET PRODUCT

// router.get("/find/:id", async (req, res) => {
//   try {
//     const product = await Blog.findById(req.params.id);
//     res.status(200).send(product);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// module.exports = router;




const {Blog} = require("../models/blog");
const express = require("express");
// const router = require("express").Router();
const router = express.Router();
// const path = require('path');
// const multer = require('multer');






//CREATE POST
router.post("/", async (req, res) => {
  // const { name,title,desc } = req.body;

  try {
    // const newPost = new Blog({
    //   title,
    //   desc,
    //   name
    // });
      const newPost = new Blog(req.body);
    const savedPost = await newPost.save();
    res.status(200).send(savedPost);
    // res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (post.name === req.body.name) {
      try {
        const updatedPost = await Blog.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (post.name === req.body.name) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Blog.find({ username });
    } else if (catName) {
      posts = await Blog.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Blog.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;