const { userTypeDef } = require("./Users/typeDef");
const { userResolver } = require("./Users/resolver");
const { dateTime } = require("./ScalarTypes/dateTime");
const { messageTypeDefs } = require("./Messages/typeDefs");
const { MessagesResolver } = require("./Messages/resolvers");
const { rootTypeDef } = require("./typeDefs.root");
const { Subscription, SubscriptionTypeDef } = require("./subscription");

const typeDefs = [
  rootTypeDef,
  SubscriptionTypeDef,
  userTypeDef,
  messageTypeDefs,
];

const resolvers = [dateTime, userResolver, { Subscription }, MessagesResolver];

module.exports = {
  typeDefs,
  resolvers,
};
