const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

//Dotenv
require("dotenv").config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connnect to DB
mongoose.connect(
  "mongodb+srv://lishugupta652:lishugupta652@firstcluster-76qkd.mongodb.net/<dbname>?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("Connected to MongoDB")
);

// Routes
const authRoute = require("./routes/auth");

// Route Middle Ware
app.use("/api/user", authRoute);

// home Route
app.get("/", (req, res) => {
  res.send("<h1>APP RUNNING</h1>");
});

app.listen(3000, () => console.log("Server is running"));
