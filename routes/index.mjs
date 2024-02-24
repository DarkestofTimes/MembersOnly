import express from "express";

export const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.user);
  res.render("index", { user: req.user });
});
