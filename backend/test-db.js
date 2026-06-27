require("dotenv").config();
const db = require("./config/db"); // apne db.js ka path lagana

async function test() {
  try {
    const [rows] = await db.query("SELECT NOW() as time");
    console.log("Connected Successfully");
    console.log(rows);
  } catch (err) {
    console.error(err);
  }
}

test();