const express = require("express");
const router = express.Router();

const {
  postUser
} = require("./controlers.js");

router.post("/register",postUser)
module.exports = router;
