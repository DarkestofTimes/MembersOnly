import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "../models/User.mjs";

export const router = express.Router();

const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Incorrect credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "Incorrect credentials" });
    }
    return done(null, user);
  } catch (err) {
    return done(err, { message: "Internal Error" });
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
  const errMessage = req.session.messages ? req.session.messages : "";
  delete req.session.messages;
  res.render("logIn", {
    user: req.user ? req.user.username : null,
    errMessage: errMessage,
  });
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/logIn",
    failureMessage: true,
  })
);
