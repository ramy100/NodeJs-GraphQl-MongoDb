const { gql } = require("apollo-server");

const rootTypeDef = gql`
  interface mutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  interface token {
    token: String
    user: User
  }
  input RegisterUserInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
    avatar: String
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  type Query {
    user(id: String!): User
    users: [User]
    messages: [Message]
  }

  type Mutation {
    register(newUser: RegisterUserInput): registerOrLoginResponse!
    login(userInfo: LoginUserInput): registerOrLoginResponse!
    sendFriendRequest(friendId: ID!): response
    sendMessage(friendId: ID!, content: String): MessageResponse!
    deleteAllFriendRequests: Boolean!
    deleteAllUsers: Boolean!
  }
`;

module.exports = { rootTypeDef };
