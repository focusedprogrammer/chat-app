const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const [user] = await db.query(
      "SELECT * FROM users WHERE username=? OR email=?",
      [username, email]
    );

    if (user.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users(name,username,email,password)
       VALUES(?,?,?,?)`,
      [name, username, email, hashedPassword]
    );

    res.status(201).json({
      message: "Signup Successful",
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [user] = await db.query(
      "SELECT * FROM users WHERE username=?",
      [username]
    );

    if (user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user[0].password
      );

    if (!validPassword) {
      return res.status(400).json({
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      {
        id: user[0].id,
        username: user[0].username
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        username: user[0].username,
        email: user[0].email
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.profile = async (req, res) => {

  const [user] = await db.query(
    "SELECT id,name,username,email FROM users WHERE id=?",
    [req.user.id]
  );

  res.json(user[0]);
};

exports.searchUsers = async (req, res) => {

  const search = req.query.search || "";

  const [users] = await db.query(
    `SELECT id,name,username,email
     FROM users
     WHERE username LIKE ?
     OR name LIKE ?`,
    [`%${search}%`, `%${search}%`]
  );

  res.json(users);
};