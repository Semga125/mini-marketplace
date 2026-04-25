const express = require("express");
const router = express.Router();

const {
  postUser,
  loginUser
} = require("./controlers.js");

router.post("/register",postUser)
router.post("/login",loginUser)
module.exports = router;
