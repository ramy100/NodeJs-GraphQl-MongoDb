const User = require("../../models/Users");
const { GraphQlResponseWithToken, GraphQlResponse } = require("../Response");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getToken = ({ id, username, email }) =>
  jwt.sign(
    {
      id,
      username,
      email,
    },
    process.env.SECRET,
    { expiresIn: "1d" }
  );

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

    const user = await User.findOne({ email });
    if (user) {
      return new GraphQlResponse(403, false, "User Already Exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
      const response = await newUser.save();
      const token = getToken(response);
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
    const user = await User.findOne({ email });
    if (!user)
      return new GraphQlResponse(404, false, "Email Is Not Registered!");

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return new GraphQlResponse(403, false, "Incorrect Credentials!");

    const token = getToken(user); // generate a token if no erros.

    return new GraphQlResponseWithToken(
      200,
      true,
      "User Logged in Successfully!",
      token,
      user
    );
  },

  addFriend: async (myId, friendId, user) => {
    if (user.id !== myId)
      return new GraphQlResponse(403, false, "UnAuthorized Action!");
    if (myId == friendId)
      return new GraphQlResponse(403, false, "Can't Add Your Self!");
    //   need transaction here
    try {
      const user = await User.findById(myId);
      const friend = await User.findById(friendId);
      if (!user || !friend) {
        return new GraphQlResponse(404, false, "User Not Found!");
      }
      if (user.friends.includes(friendId) || friend.friends.includes(myId)) {
        return new GraphQlResponse(403, false, "Already Added this friend!");
      }
      user.friends.push(friendId);
      friend.friends.push(myId);
      await user.save();
      await friend.save();
    } catch (error) {
      return new GraphQlResponse(500, false, "Server Error!");
    }
    return new GraphQlResponse(200, true, "User Added!");
  },
};

module.exports = UserGraqhQl;
