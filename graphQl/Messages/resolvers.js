const MessagesModel = require("./Message.model");
const { MessagesGraphQl } = require("./Message");
const Query = {
  messages: async () => {
    return await MessagesModel.find({}).populate(["from", "to"]);
  },
};

const Mutation = {
  sendMessage: (_, { friendId, content }, { user, pubsub }) =>
    MessagesGraphQl.sendMessage(user.id, friendId, content, pubsub),
};

const MessagesResolver = {
  Query,
  Mutation,
};

module.exports = { MessagesResolver };
