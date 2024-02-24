import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "../models/User.mjs";

export const router = express.Router();

const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    const match = await bcrypt.compare(password, user.password);
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.get("/", (req, res) => {
  console.log(req.user);
  res.render("logIn", { user: req.user });
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/logIn",
  })
);
