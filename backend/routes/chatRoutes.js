const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  startConversation,
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} = require("../controllers/chatController");

router.post("/start", auth, startConversation);

router.post("/send", auth, sendMessage);

router.get("/messages/:conversationId", auth, getMessages);

router.put("/message/:id", auth, editMessage);

router.delete("/message/:id", auth, deleteMessage);

module.exports = router;
