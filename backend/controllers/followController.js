const db = require("../config/db");

exports.sendRequest = async (req, res) => {

  try {

    const senderId = req.user.id;

    const { receiverId } = req.body;

    if (senderId == receiverId) {
      return res.status(400).json({
        message: "Cannot follow yourself"
      });
    }

    const [existing] = await db.query(
      `SELECT *
       FROM follows
       WHERE sender_id=?
       AND receiver_id=?`,
      [senderId, receiverId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Request already sent"
      });
    }

    await db.query(
      `INSERT INTO follows
      (sender_id,receiver_id)
      VALUES (?,?)`,
      [senderId, receiverId]
    );

    res.json({
      message: "Follow Request Sent"
    });

  } catch (err) {

    res.status(500).json(err);
  }
};

exports.acceptRequest = async (req,res)=>{

try{

const { requestId } = req.body;

await db.query(
`
UPDATE follows
SET status='accepted'
WHERE id=?
`,
[requestId]
);

res.json({
message:"Request Accepted"
});

}catch(err){
res.status(500).json(err);
}
};

exports.getRequests = async (req,res)=>{

try{

const userId = req.user.id;

const [requests] = await db.query(
`
SELECT
f.id,
u.name,
u.username
FROM follows f
JOIN users u
ON u.id=f.sender_id
WHERE receiver_id=?
AND status='pending'
`,
[userId]
);

res.json(requests);

}catch(err){
res.status(500).json(err);
}
};

exports.getFriends = async (req,res)=>{

try{

const userId=req.user.id;

const [friends]=await db.query(
`
SELECT DISTINCT
u.id,
u.name,
u.username
FROM users u
JOIN follows f
ON(
(u.id=f.sender_id
AND f.receiver_id=?)

OR

(u.id=f.receiver_id
AND f.sender_id=?)
)
WHERE f.status='accepted'
`,
[userId,userId]
);

res.json(friends);

}catch(err){
res.status(500).json(err);
}
};

