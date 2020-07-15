const router = require("express").Router();
const User = require("../model/userModel");
const { loginValidation, registerValidation } = require("../validation");
const bcrypt = require("bcryptjs");

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

  // Hash the passowrd
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const savedUser = await user.save();
    res.json({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  // Joi Validation
  const { error } = loginValidation(req.body);
  if (error) res.status(400).send(error.details[0].message);

  // Checking if user is already in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found.");
  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  res.send("logged in ");
});
module.exports = router;
