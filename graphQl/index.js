const { userTypeDef } = require("./Users/typeDef");
const { userResolver } = require("./Users/resolver");
const { dateTime } = require("./ScalarTypes/dateTime");
const { messageTypeDefs } = require("./Messages/typeDefs");
const { MessagesResolver } = require("./Messages/resolvers");

const typeDefs = [userTypeDef, messageTypeDefs];

const resolvers = [dateTime, userResolver, MessagesResolver];

module.exports = {
  typeDefs,
  resolvers,
};
