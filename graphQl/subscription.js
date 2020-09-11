const { withFilter, gql } = require("apollo-server");

const SubscriptionTypeDef = gql`
  type Subscription {
    chatMessages(userId: ID!): Message!
    friendRequests(userId: ID!): FriendRequest
  }
`;

const Subscription = {
  friendRequests: {
    // Additional event labels can be passed to asyncIterator creation
    subscribe: withFilter(
      (_, __, { pubsub }) => pubsub.asyncIterator("FRIEND_REQUEST_RECIEVED"),
      (payload, variables, context) => {
        return (
          payload.friendRequests.toUser.id === variables.userId &&
          payload.friendRequests.toUser.id === context.user.id
        );
      }
    ),
  },
  chatMessages: {
    // Additional event labels can be passed to asyncIterator creation
    subscribe: withFilter(
      (_, __, { pubsub }) => pubsub.asyncIterator("NEW_CHAT_MESSAGE"),
      (payload, variables, context) => {
        return (
          payload.chatMessages.to._id == variables.userId &&
          payload.chatMessages.to._id == context.user.id
        );
      }
    ),
  },
};
module.exports = { Subscription, SubscriptionTypeDef };
