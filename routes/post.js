const router = require("express").Router();
const verify = require("./verifyToken");
const User = require("../model/userModel");

router.get("/", verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  res.send(user);
});

module.exports = router;
