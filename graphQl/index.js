const { userTypeDef } = require("./Users/typeDef");
const { userResolver } = require("./Users/resolver");
const { dateTime } = require("./ScalarTypes/dateTime");

const typeDefs = [userTypeDef];

const resolvers = [dateTime, userResolver];

module.exports = {
  typeDefs,
  resolvers,
};
