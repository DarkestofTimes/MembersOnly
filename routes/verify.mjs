import express from "express";
import { assignTokenToUser, setVerifiedForUser } from "../CRUD.mjs";
import { generateVerificationToken, verifyToken } from "../verification.mjs";

export const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.user);
  res.render("verify", { user: req.user, token: req.query.token });
});

router.post("/getToken", async (req, res) => {
  if (req.isAuthenticated()) {
    const token = generateVerificationToken(req.user._id);
    await assignTokenToUser(req.user._id, token);
    console.log(req.user);
    res.redirect(`/verify/?token=${token}`);
  } else {
    res.redirect("/logIn");
  }
});

router.post("/verifyToken", async (req, res) => {
  if (req.isAuthenticated()) {
    const token = req.query.token;
    if (token) {
      try {
        if (verifyToken(token)) {
          await setVerifiedForUser(req.user._id);
          console.log(req.user);
          res.redirect("/");
        }
      } catch (error) {
        res.status(401).send("Invalid or expired token");
      }
    } else {
      res.status(400).send("Token not provided");
    }
  } else {
    res.redirect("/logIn");
  }
});