import express from "express";
import { createUser } from "../CRUD.mjs";
import { body, validationResult } from "express-validator";
import { generateErrorObject } from "../generateErrorObject.mjs";

export const router = express.Router();

router.get("/", (req, res) => res.render("signUp", { errors: {} }));

router.post(
  "/",
  body("username")
    .notEmpty()
    .withMessage("Cannot be empty")
    .isLength({ min: 2, max: 24 })
    .withMessage("Username must be between 2 and 24 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can contain only letters, numbers, hyphens, and underscores"
    )
    .custom((value, { req }) => {
      req.body.originalUsername = value;
      return true;
    })
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Cannot be empty")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one digit")
    .escape(),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Cannot be empty")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorObject = generateErrorObject(errors.array());

        return res.render("signUp", {
          errors: errorObject,
          username: req.body.originalUsername,
        });
      }
      await createUser(req.body.username, req.body.password);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }
);
