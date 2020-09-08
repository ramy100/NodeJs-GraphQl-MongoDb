const db = require("./config/db.js");
const { ApolloServer, PubSub } = require("apollo-server");
const { resolvers, typeDefs } = require("./graphQl/index");
const AuthFunctions = require("./graphQl/utils/auth.utils.js");
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: () => {
      console.log("connected");
    },
    onDisconnect: () => {
      console.log("dc");
    },
  },
  // context: ({ req, connection }) => ({ pubsub }),
  context: ({ req, connection }) => {
    const returnObj = {};
    if (connection) {
      const token = connection.context.authorization;
      if (token) {
        const user = AuthFunctions.VerifyToken(token);
        returnObj.user = user;
      }
    } else {
      const token = req.headers.authorization || "";
      if (token) {
        const user = AuthFunctions.VerifyToken(token);
        returnObj.user = user;
      }
    }
    returnObj.pubsub = pubsub;
    console.log("trash");
    return returnObj;
  },
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected to mongoDb");
});
// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
