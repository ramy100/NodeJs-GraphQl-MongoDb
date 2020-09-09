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
`;

module.exports = {
  userTypeDef,
};
