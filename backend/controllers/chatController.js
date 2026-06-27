const db = require("../config/db");

exports.startConversation = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    const user1 = Math.min(userId, friendId);
    const user2 = Math.max(userId, friendId);

    const [existing] = await db.query(
      `SELECT * FROM conversations
       WHERE user1_id=? AND user2_id=?`,
      [user1, user2]
    );

    if (existing.length > 0) {
      return res.json(existing[0]);
    }

    const [result] = await db.query(
      `INSERT INTO conversations
       (user1_id,user2_id)
       VALUES (?,?)`,
      [user1, user2]
    );

    res.json({
      id: result.insertId,
      user1_id: user1,
      user2_id: user2
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

exports.sendMessage = async (
  req,
  res
) => {

  try {

    const {
      conversationId,
      message
    } = req.body;

    const senderId =
      req.user.id;

    const [result] =
    await db.query(
      `
      INSERT INTO messages
      (conversation_id,sender_id,message)
      VALUES (?,?,?)
      `,
      [
        conversationId,
        senderId,
        message
      ]
    );

    const [conversation] =
    await db.query(
      `
      SELECT *
      FROM conversations
      WHERE id=?
      `,
      [conversationId]
    );

    const friendId =
      conversation[0]
      .user1_id === senderId
      ? conversation[0].user2_id
      : conversation[0].user1_id;

    const io =
      req.app.get("io");

    io.to(
      `user_${friendId}`
    ).emit(
      "receiveMessage",
      {
        id: result.insertId,
        conversation_id:
        conversationId,
        sender_id:
        senderId,
        message
      }
    );

    res.json({
      message:
      "Message Sent"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
      "Server Error"
    });

  }

};

exports.getMessages = async (req, res) => {

  try {

    const { conversationId } = req.params;

    const [messages] = await db.query(
      `SELECT *
      FROM messages
      WHERE conversation_id=?
      ORDER BY created_at ASC`,
      [conversationId]
    );

    res.json(messages);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM messages WHERE id=?",
      [id]
    );

    res.json({
      success: true
    });

  } catch (err) {

    res.status(500).json({
      message: "Server Error"
    });

  }
};

exports.editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    await db.query(
      `
      UPDATE messages
      SET message = ?
      WHERE id = ?
      `,
      [text, id]
    );

    res.json({
      success: true,
      message: "Message updated"
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false
    });
  }
};

