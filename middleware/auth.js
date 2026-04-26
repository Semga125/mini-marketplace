const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).send("No token");
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).send("No token");
  }

  try {
    const user = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
};

module.exports = auth;