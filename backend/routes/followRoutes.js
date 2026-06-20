const express = require("express");

const router = express.Router();

const auth =
require("../middleware/authMiddleware");

const {
sendRequest,
acceptRequest,
getRequests,
getFriends
}
=
require("../controllers/followController");

router.post(
"/send",
auth,
sendRequest
);

router.post(
"/accept",
auth,
acceptRequest
);

router.get(
"/requests",
auth,
getRequests
);

router.get(
"/friends",
auth,
getFriends
);

module.exports = router;