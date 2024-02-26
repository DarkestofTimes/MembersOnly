import express from "express";
import { body, query } from "express-validator";
import { Message } from "../models/Message.mjs";
import {
  retrieveFromDB,
  createMessage,
  editMessage,
  deleteMessage,
  toggleAdmin,
} from "../CRUD.mjs";

export const router = express.Router();

router.get("/", async (req, res) => {
  const messages = await retrieveFromDB(Message, {
    path: "user",
    select: "_id username",
  });
  const messageToEdit = req.query.messageId
    ? messages.find((message) => message._id.toString() === req.query.messageId)
    : "";
  res.render("index", {
    user: req.user ? req.user.username : "",
    userId: req.user ? req.user.id : "",
    verified: req.user ? req.user.verified : "",
    admin: req.user ? req.user.admin : "",
    messages: messages,
    messageToEdit: messageToEdit,
  });
});

router.post(
  "/postMessage",
  body("subject").escape(),
  body("message").escape(),
  async (req, res) => {
    if (req.user.verified) {
      await createMessage(req.user._id, req.body.subject, req.body.message);
      res.redirect("/");
    } else if (!req.user) {
      res.redirect("/logIn");
    } else if (!req.user.verified) {
      res.redirect("/verify");
    }
  }
);

router.post(
  "/editMessage",
  query("userId").escape(),
  query("messageId").escape(),
  async (req, res) => {
    if (!req.query.messageId || !req.query.userId) {
      return res.status(400).json({ error: "Missing parameters" });
    }
    if (req.query.userId === req.user._id.toString()) {
      res.redirect(`/?messageId=${req.query.messageId}`);
    } else {
      return res.status(403).send("Unauthorized");
    }
  }
);

router.post(
  "/updateMessage",
  body("subject").escape(),
  body("message").escape(),
  async (req, res) => {
    if (
      req.user.messages.find(
        (message) => message._id.toString() === req.query.messageId
      )
    ) {
      await editMessage(
        req.query.messageId,
        req.body.subject,
        req.body.message
      );
    }
    res.redirect("/");
  }
);

router.get("/adminOn", async (req, res) => {
  await toggleAdmin(req.user._id, req.user.admin);
  res.redirect("/");
});
router.get("/adminOff", async (req, res) => {
  await toggleAdmin(req.user._id, req.user.admin);
  res.redirect("/");
});

router.post("/deleteMessage", async (req, res) => {
  if (req.user.admin || req.user._id.toString() === req.query.userId) {
    await deleteMessage(req.query.messageId, req.query.userId);
  }
  res.redirect("/");
});
