const { gql } = require("apollo-server");

const messageTypeDefs = gql`
  type Message {
    id: ID!
    from: User!
    to: User!
    content: String!
    created_at: DateTime!
  }
  type MessageResponse implements mutationResponse {
    code: String!
    success: Boolean!
    message: String!
    chatMessage: Message!
  }
`;

module.exports = { messageTypeDefs };
