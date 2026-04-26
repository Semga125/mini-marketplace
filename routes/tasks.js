const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");

const {
  postUser,
  loginUser,refreshTokenHandler
} = require("./controlers.js");
router.get("/refresh", refreshTokenHandler);
router.post("/register",postUser)
router.post("/login",loginUser)

router.get("/me", auth, (req, res) => {
  res.json({
    user: req.user
  });
}); 
module.exports = router;
