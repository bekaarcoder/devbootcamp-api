const express = require("express");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

app.get("/api/v1/bootcamps", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
});

app.get("/api/v1/bootcamp/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp with id ${req.params.id}` });
});

app.post("/api/v1/bootcamp", (req, res) => {
  res.status(201).json({ success: true, msg: "Bootcamp created" });
});

app.put("/api/v1/bootcamp/:id", (req, res) => {
  res
    .status(201)
    .json({ success: true, msg: `Bootcamp with id ${req.params.id} updated` });
});

app.delete("/api/v1/bootcamp/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Bootcamp ${req.params.id} deleted` });
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`
  )
);
