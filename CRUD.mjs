import { User } from "../models/User.mjs";
import { Message } from "../models/Message.mjs";

export const retrieveFromDB = async (model, request) => {
  return await model.find().populate(request).exec();
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

export const editMessage = async (
  messageId,
  userId,
  subject,
  messageContent
) => {
  await Message.findByIdAndUpdate(messageId, {
    subject: subject,
    message: messageContent,
  });

  await User.findByIdAndUpdate(userId, { $pull: { messages: messageId } });
};

export const deleteMessage = async (messageId, userId) => {
  await Message.findByIdAndDelete(messageId);

  await User.findByIdAndUpdate(userId, { $pull: { messages: messageId } });
};

/* export const insertToDB = async (model1, model2, data) => {
  const item = new model1({
    ...data,
    _id: new mongoose.Types.ObjectId(),
  });

  const item2 = new model2({
    ...data,
    username: item._id,
  });

  await item2.save();

  item.messages.push(item2._id);
  await item.save();
}; */