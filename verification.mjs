import jwt from "jsonwebtoken";

export const generateVerificationToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
