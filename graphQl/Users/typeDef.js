const { gql } = require("apollo-server");

const userTypeDef = gql`
  scalar DateTime

  type Subscription {
    friendRequests(userId: ID!): [User!]
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    friends: [User]!
    registered_at: DateTime!
    deactivated_at: DateTime
  }

  type registerOrLoginResponse implements mutationResponse & token {
    code: String!
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  type response implements mutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type Query {
    user(id: String!): User
    users: [User]
  }

  type Mutation {
    register(newUser: RegisterUserInput): registerOrLoginResponse!
    login(userInfo: LoginUserInput): registerOrLoginResponse!
    sendFriendRequest(friendId: ID!): response
  }

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
`;

module.exports = {
  userTypeDef,
};
