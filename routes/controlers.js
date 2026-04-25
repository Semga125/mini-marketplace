const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


const postUser = async (req, res) => {
  try {
    console.log(" postUser called with body:", req.body);

    const { login, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
const [existing] = await db.query(
  "SELECT * FROM peoples68 WHERE login = ?",
  [login]
);

if (existing.length) {
  return res.status(400).json({ message: "User already exists" });
}
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
const loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: "Missing login or password" });
    }

    const [rows] = await db.query(
      "SELECT * FROM peoples68 WHERE login = ?",
      [login]
    );

    if (!rows.length) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "successfully"
    });

  } catch (err) {
    res.status(500).send("Error");
  }
};


module.exports = {
  postUser,
  loginUser
  
};