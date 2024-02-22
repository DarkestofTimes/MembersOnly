import express from "express";
import bcrypt from "bcryptjs";

import { User } from "../models/User.mjs";

export const router = express.Router();

router.get("/", (req, res) => res.render("signUp"));

router.post("/", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      messages: [],
    });
    await user.save();
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});
