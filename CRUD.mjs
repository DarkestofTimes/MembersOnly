import { User } from "./models/User.mjs";
import { Message } from "./models/Message.mjs";
import bcrypt from "bcryptjs";

export const retrieveFromDB = async (model, request) => {
  const retrievedData = await model.find().populate(request).exec();
  if (!retrievedData) {
    throw new Error("Message not found");
  }
  return retrievedData;
};

export const createMessage = async (userId, subject, messageContent) => {
  const message = new Message({
    user: userId,
    subject: subject,
    message: messageContent,
  });

  await message.save();

  await User.findByIdAndUpdate(userId, { $push: { messages: message._id } });
};

export const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username: username,
    password: hashedPassword,
    messages: [],
    verified: false,
    admin: false,
    jwt: "",
  });
  await user.save();
};

export const editMessage = async (messageId, subject, messageContent) => {
  const updatedMessage = await Message.findByIdAndUpdate(messageId, {
    subject: subject,
    message: messageContent,
  });
  if (!updatedMessage) {
    throw new Error("Message not found");
  }
};

export const deleteMessage = async (messageId, userId) => {
  const deletedMessage = await Message.findByIdAndDelete(messageId);
  if (!deletedMessage) {
    throw new Error("User not found");
  }
  await User.findByIdAndUpdate(userId, { $pull: { messages: messageId } });
};

export const assignTokenToUser = async (userId, token) => {
  const updatedUser = await User.findByIdAndUpdate(userId, { jwt: token });
  if (!updatedUser) {
    throw new Error("User not found");
  }
};

export const setVerifiedForUser = async (userId) => {
  const updatedUser = await User.findByIdAndUpdate(userId, { verified: true });
  if (!updatedUser) {
    throw new Error("User not found");
  }
};

export const toggleAdmin = async (userId) => {
  const updatedUser = await User.findByIdAndUpdate(userId, {
    $bit: { admin: { xor: 1 } },
  });
  if (!updatedUser) {
    throw new Error("User not found");
  }
};
