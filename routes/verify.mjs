import express from "express";
import { assignTokenToUser, setVerifiedForUser } from "../CRUD.mjs";
import { generateVerificationToken, verifyToken } from "../IssueVerifyJWT.mjs";

export const router = express.Router();

router.get("/", (req, res) => {
  let Error = "";
  if (req.session.tempError) {
    Error = JSON.parse(JSON.stringify(req.session.tempError));
    delete req.session.tempError;
  }
  console.log(Error);
  res.render("verify", {
    user: req.user ? req.user.username : "",
    token: req.query.token,
    verified: req.user ? req.user.verified : false,
    error: Error.length > 0 ? Error : null,
  });
});

router.get("/getToken", async (req, res) => {
  if (req.isAuthenticated()) {
    const token = generateVerificationToken(req.user._id);
    await assignTokenToUser(req.user._id, token);
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
          res.redirect("/");
        }
      } catch (error) {
        req.session.tempError =
          "Token has expired and was issued anew, verify new token";
        res.redirect("/verify/getToken");
      }
    } else {
      res.status(400).send("Token not provided");
    }
  } else {
    res.redirect("/logIn");
  }
});
