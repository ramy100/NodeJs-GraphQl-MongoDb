const MessageModel = require("./Message.model");
const UserModel = require("../Users/User.model");
const { GraphQlResponseWithChat, GraphQlResponse } = require("../Response");

const MessagesGraphQl = {
  readMessages: (userId, friendId) => {
    // MessageModel.find({
    //   from: { $in: [userId, friendId], to: { $in: [userId, friendId] } },
    // });
  },
  sendMessage: async (userId, friendId, content) => {
    if (!userId || !friendId)
      return new GraphQlResponse(404, false, "User Not Found!");

    const currentUser = await UserModel.find(userId);
    const friend = await UserModel.find(friendId);

    if (!currentUser || !friend)
      return new GraphQlResponse(404, false, "User Not Found!");

    if (
      !currentUser.friends.includes(friendId) ||
      !friend.friends.includes(userId)
    )
      return new GraphQlResponse(403, false, "You Are Not Friends!");

    const newMessage = new MessageModel({
      from: userId,
      to: friendId,
      content,
    });
    try {
      await newMessage.collection.save(newMessage);
      return new GraphQlResponseWithChat(
        200,
        true,
        "Message Sent Successfully!",
        newMessage
      );
    } catch (error) {
      return new GraphQlResponse(500, false, "server error");
    }
  },
  deleteMessage: (userId, messageId) => {},
};

module.exports = { MessagesGraphQl };
