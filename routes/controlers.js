const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


const postUser = async (req, res) => {
  try {
    console.log(" postUser called with body:", req.body);

    const { login, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO peoples68 (login,password) VALUES (?,?)",
      [login, hashedPassword]
    );

    console.log(" User inserted with ID:", result.insertId);

    const user = {
      id: result.insertId,
      login
    };

    res.json({
      message: "succefully"
    });

  } catch (err) {
    console.error(" postUser error:", err.message);
    res.status(500).send("Error");
  }
};

module.exports = {
  postUser
  
};