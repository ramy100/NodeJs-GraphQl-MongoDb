const UserGraqhQl = require("./User");
require("dotenv").config();

const Query = {
  user: (_, { id }) => UserGraqhQl.getUser(id),
  users: () => UserGraqhQl.getAll(),
};

const Mutation = {
  register: (_, { newUser }) => UserGraqhQl.registerNewUser(newUser),

  login: (_, { userInfo }) => UserGraqhQl.login(userInfo),

  sendFriendRequest: (_, { friendId }, { user }) =>
    UserGraqhQl.sendFriendRequest(user, friendId),
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
