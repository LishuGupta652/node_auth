const router = require("express").Router();
const User = require("../model/userModel");
const { loginValidation, registerValidation } = require("../validation");
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.post("/register", async (req, res) => {
  // Joi Validation
  const { error } = registerValidation(req.body);
  if (error) res.status(400).send(error.details[0].message);

  // Checking if user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
