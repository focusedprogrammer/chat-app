const express = require("express");

const router = express.Router();

const auth =
require("../middleware/authMiddleware");

const {
  startConversation,
  sendMessage,
  getMessages
}
=
require("../controllers/chatController");

router.post(
  "/start",
  auth,
  startConversation
);

router.post(
  "/send",
  auth,
  sendMessage
);

router.get(
  "/messages/:conversationId",
  auth,
  getMessages
);

module.exports = router;