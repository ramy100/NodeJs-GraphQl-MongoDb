const { UserGraqhQl } = require("./User");
require("dotenv").config();
const User = require("./User.model");

const Query = {
  user: (_, { id }) => UserGraqhQl.getUser(id),
  users: () => UserGraqhQl.getAll(),
};

const Mutation = {
  register: (_, { newUser }) => UserGraqhQl.registerNewUser(newUser),

  login: (_, { userInfo }) => UserGraqhQl.login(userInfo),

  sendOrAcceptFriendRequest: (_, { friendId }, { user, pubsub }) =>
    UserGraqhQl.sendOrAcceptFriendRequest(user, friendId, pubsub),

  deleteAllFriendRequests: async () => {
    await User.updateMany({}, { $set: { friendRequests: [], friends: [] } });
    return true;
  },
  deleteAllUsers: async () => {
    await User.deleteMany({});
    return true;
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
};

module.exports = {
  userResolver,
};
