const express = require("express");
const router = express.Router();

app.get("/", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
});

app.get("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp with id ${req.params.id}` });
});

app.post("/", (req, res) => {
  res.status(201).json({ success: true, msg: "Bootcamp created" });
});

app.put("/:id", (req, res) => {
  res
    .status(201)
    .json({ success: true, msg: `Bootcamp with id ${req.params.id} updated` });
});

router.delete("/:id", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Bootcamp ${req.params.id} deleted` });
});

module.exports = router;
