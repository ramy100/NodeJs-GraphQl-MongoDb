const db = require("./config/db.js");
const { ApolloServer, PubSub } = require("apollo-server");
const { resolvers, typeDefs } = require("./graphQl/index");
const jwt = require("jsonwebtoken");

const pubsub = new PubSub();

const getUser = (token) => {
  try {
    const user = jwt.verify(token, process.env.SECRET);
    return user;
  } catch (error) {
    return undefined;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, connection }) => {
    if (connection) {
      const token = connection.context.authorization;
      if (token) {
        const user = getUser(token);
        return {
          user,
          pubsub,
        };
      }
    } else {
      const token = req.headers.authorization || "";
      if (token) {
        const user = getUser(token);
        return {
          user,
          pubsub,
        };
      }
    }
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
