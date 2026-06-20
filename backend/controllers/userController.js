const db = require("../config/db");

exports.getCurrentUser = async (req, res) => {
  try {

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email
      FROM users
      WHERE id = ?
      `,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(users[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};