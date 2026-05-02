const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, login: user.login },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

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
// 
const { accessToken, refreshToken } = generateTokens(user);

    
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: false,
  sameSite: "strict"
});

res.json({
  accessToken
});
  } catch (err) {
    console.error(" postUser error:", err.message);
    res.status(500).send("Error");
  }
};const loginUser = async (req, res) => {
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

    //
    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    });

    res.json({
      accessToken
    });

  } catch (err) {
    res.status(500).send("Error");
  }
};
const refreshTokenHandler = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });

  } catch {
    return res.sendStatus(403);
  }
};



const createPost = async (req,res) => {
  try {
  const { title, description, price } = req.body;

if (!title || !description || price === undefined)  {
  return res.status(400).send("Missing fields");
}
    const userId = req.user.id

    
    await db.query(
      "INSERT INTO posts (user_id, title, description, price) VALUES (?, ?, ?, ?)",
[userId, title, description, price]
    );
    console.log("CREATE POST:", req.body, req.user);
  res.json({ message: "Post created" });
  }
 catch (err) {
  console.error(err);
  return res.status(500).send("ERROR");
}
}

const getPosts = async (req, res) => {
  try {
    const search = req.query.search;

    let query = "SELECT * FROM posts";
    let params = [];

    if (search) {
      query += " WHERE title LIKE ?";
      params.push(`%${search}%`);
    }

    query += " ORDER BY id DESC";

    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (err) {
    res.status(500).send("Error");
  }
};


module.exports = {
  postUser,
  loginUser,
  refreshTokenHandler,createPost,getPosts
  
};