const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");

const {
  postUser,
  loginUser,refreshTokenHandler,createPost,getPosts
} = require("./controlers.js");
router.get("/refresh", refreshTokenHandler);
router.post("/register",postUser)
router.post("/login",loginUser)
router.post("/posts", auth, createPost);
router.get("/posts", getPosts);
router.get("/me", auth, (req, res) => {
  res.json({
    user: req.user
  });
}); 
module.exports = router;
