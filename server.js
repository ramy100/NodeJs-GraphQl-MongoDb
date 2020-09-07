const db = require("./config/db.js");
const { ApolloServer } = require("apollo-server");
const { resolvers, typeDefs } = require("./graphQl/index");
const jwt = require("jsonwebtoken");

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
  context: ({ req, res }) => {
    const token = req.headers.authorization || "";
    if (token) {
      const user = getUser(token);
      return {
        user,
      };
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
