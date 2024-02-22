import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";

import { connectToDB, disconnectFromDB } from "./dbConnectDisconnect.mjs";
import { router as signUp } from "./routes/signUp.mjs";
import { router as logIn } from "./routes/logIn.mjs";
import { router as index } from "./routes/index.mjs";

const app = express();
const PORT = process.env.PORT || 5000;
connectToDB().then(app.listen(PORT));
const db = mongoose.connection;

app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      collectionName: "sessions",
      client: db.getClient(),
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", index);
app.use("/signUp", signUp);
app.use("/logIn", logIn);

process.on("SIGINT", async () => {
  await disconnectFromDB();
  process.exit(0);
});
