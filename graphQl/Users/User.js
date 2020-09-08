const User = require("./User.model");
const { GraphQlResponseWithToken, GraphQlResponse } = require("../Response");
const bcrypt = require("bcryptjs");
const MongoFunctions = require("../utils/mongo.utils");
const AuthFunctions = require("../utils/auth.utils");

const UserFunctions = new MongoFunctions(User);

const UserGraqhQl = {
  getUser: (id) => {
    return User.findById(id).populate("friends");
  },
  getAll: () => {
    return User.find().populate("friends");
  },

  registerNewUser: async ({ email, username, password, confirmPassword }) => {
    if (password != confirmPassword) {
      return new GraphQlResponse(403, false, "Password Confirmation Fails!");
    }

    const user = await UserFunctions.getDocumentByValue({ email });
    if (user) {
      return new GraphQlResponse(403, false, "User Already Exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = UserFunctions.createNewObject({
      username,
      email,
      password: hashedPassword,
    });

    try {
      const response = await UserFunctions.saveDocument(newUser);
      const token = AuthFunctions.getToken(response);
      const registeredUser = {
        id: response._id,
        ...response._doc,
      };
      return new GraphQlResponseWithToken(
        200,
        true,
        "User Registered Successfully!",
        token,
        registeredUser
      );
    } catch (err) {
      console.log(err);
      return new GraphQlResponse(500, false, "Server Error!");
    }
  },

  login: async ({ email, password }) => {
    const user = await UserFunctions.getDocumentByValue({ email });
    if (!user)
      return new GraphQlResponse(404, false, "Email Is Not Registered!");

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return new GraphQlResponse(403, false, "Incorrect Credentials!");

    const token = AuthFunctions.getToken(user); // generate a token if no erros.

    return new GraphQlResponseWithToken(
      200,
      true,
      "User Logged in Successfully!",
      token,
      user
    );
  },

  sendFriendRequest: async (user, friendId, pubsub) => {
    if (!user) return new GraphQlResponse(403, false, "Not Logged In!");
    if (!friendId) return new GraphQlResponse(404, false, "Friend Not Found!");

    if (user.id == friendId)
      return new GraphQlResponse(403, false, "Can't Add Your Self!");
    //   need transaction here
    try {
      const friend = await UserFunctions.getDocumentById(friendId);
      const currentUser = await UserFunctions.getDocumentById(user.id);
      if (!currentUser || !friend) {
        return new GraphQlResponse(404, false, "User Not Found!");
      }

      // if those users are friends already
      if (
        currentUser.friends.includes(friendId) ||
        friend.friends.includes(user.id)
      ) {
        return new GraphQlResponse(403, false, "Already Friends!");
      }
      // if current user already added that friend
      if (friend.friendRequests.includes(user.id)) {
        return new GraphQlResponse(
          403,
          false,
          "You previous add request still pending!"
        );
      }
      // if already had a friend request sent from that user add him immediatly
      if (currentUser.friendRequests.includes(friendId)) {
        friend.friends.push(user.id);
        currentUser.friends.push(friendId);
        currentUser.friendRequests.pull(friendId);
        await UserFunctions.saveDocument(currentUser);
        await UserFunctions.saveDocument(friend);
        return new GraphQlResponse(200, true, "You Are Friends Now!");
      }
      friend.friendRequests.push(user.id);
      await UserFunctions.saveDocument(friend);
      pubsub.publish("FRIEND_REQUEST_RECIEVED", {
        friendRequests: [currentUser, friend],
      });
    } catch (error) {
      return new GraphQlResponse(500, false, "Server Error!");
    }
    return new GraphQlResponse(200, true, "Sent Friend Request!");
  },
};

module.exports = { UserGraqhQl };
