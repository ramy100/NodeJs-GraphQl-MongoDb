const UserGraqhQl = require("./User");
require("dotenv").config();

const Query = {
  user: (_, { id }) => UserGraqhQl.getUser(id),
  users: () => UserGraqhQl.getAll(),
};

const Mutation = {
  register: (_, { newUser }) => UserGraqhQl.registerNewUser(newUser),

  login: (_, { userInfo }) => UserGraqhQl.login(userInfo),

  sendFriendRequest: (_, { friendId }, { user, pubsub }) =>
    UserGraqhQl.sendFriendRequest(user, friendId, pubsub),
};

const Subscription = {
  friendRequests: {
    // Additional event labels can be passed to asyncIterator creation
    subscribe: (_, __, { pubsub }) =>
      pubsub.asyncIterator("FRIEND_REQUEST_RECIEVED"),
  },
};

const token = {
  __resolveType() {
    return null;
  },
};

const mutationResponse = {
  __resolveType() {
    return null;
  },
};

const userResolver = {
  mutationResponse,
  token,
  Query,
  Mutation,
  Subscription,
};

module.exports = {
  userResolver,
};
