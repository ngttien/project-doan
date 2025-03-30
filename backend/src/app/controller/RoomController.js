const { db } = require("../../firebase/firebase");
class RoomController {
  async room(req, res) {
    const Room = db.ref("ROOM");
    const snapshot = await Room.once("value");
    if (snapshot.exists()) {
      res.json(snapshot.val());
    } else {
      res.status(404).json({ message: "khong co du lieu phong" });
    }
  }
}
module.exports = new RoomController();
