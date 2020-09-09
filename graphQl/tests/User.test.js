const { UserGraqhQl } = require("../Users/User");
const sinon = require("sinon");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PubSub } = require("apollo-server");
const User = require("../Users/User.model");

const pubsub = new PubSub();
const sandbox = sinon.createSandbox();

describe("User Model Test", () => {
  describe("Register", () => {
    const validRegisterUser = {};
    beforeEach(() => {
      validRegisterUser.username = "ramy";
      validRegisterUser.email = "r@r.com";
      validRegisterUser.password = "123456";
      validRegisterUser.confirmPassword = "123456";
    });
    afterEach(() => {
      sandbox.restore();
    });

    it("should register a user", async () => {
      sandbox.stub(User, "findOne").returns(false);
      sandbox.stub(User.collection, "save").callsFake((args) => ({
        _id: args._id,
        _doc: {
          email: args.email,
          username: args.username,
          password: args.password,
          friendRequests: args.friendRequests,
          friends: args.friendRequests,
          registered_at: args.registered_at,
        },
      }));
      const res = await UserGraqhQl.registerNewUser(validRegisterUser);
      expect(res.code).toEqual(200);
      expect(res.success).toEqual(true);
      expect(res.message).toEqual("User Registered Successfully!");
    });

    it("should not register if User already exists", async () => {
      sandbox.stub(User, "findOne").returns(true);
      const res = await UserGraqhQl.registerNewUser(validRegisterUser);
      expect(res.code).toEqual(403);
      expect(res.success).toEqual(false);
      expect(res.message).toEqual("User Already Exists!");
    });

    it("should not register user if confirmation password not equal password", async () => {
      validRegisterUser.confirmPassword = "different password";
      const res = await UserGraqhQl.registerNewUser(validRegisterUser);
      expect(res.code).toEqual(403);
      expect(res.success).toEqual(false);
      expect(res.message).toEqual("Password Confirmation Fails!");
    });
  });

  describe("Login", () => {
    const ValidLoginUser = {};
    beforeEach(() => {
      ValidLoginUser.email = "r@r.com";
      ValidLoginUser.password = "123456";
    });
    afterEach(() => {
      sandbox.restore();
    });
    it("should login User", async () => {
      sandbox.stub(User, "findOne").returns(true);
      sandbox.stub(bcrypt, "compare").returns(true);
      const res = await UserGraqhQl.login(ValidLoginUser);
      expect(res.code).toEqual(200);
    });

    it("should not login User if wrong password", async () => {
      sandbox.stub(User, "findOne").returns(true);
      sandbox.stub(bcrypt, "compare").returns(false);
      const res = await UserGraqhQl.login(ValidLoginUser);
      expect(res.code).toEqual(403);
    });

    it("should not login User if wrong email", async () => {
      sandbox.stub(User, "findOne").returns(false);
      const res = await UserGraqhQl.login(ValidLoginUser);
      expect(res.code).toEqual(404);
    });
  });

  describe("send friend requests", () => {
    afterEach(() => {
      sandbox.restore();
    });
    it("should send friend request", async () => {
      sandbox.stub(pubsub, "publish").returns(null);
      sandbox
        .stub(User, "find")
        .onFirstCall()
        .returns({ id: "1234", friendRequests: [], friends: [] })
        .onSecondCall()
        .returns({ id: "123", friendRequests: [], friends: [] });
      sandbox.stub(User.collection, "save").returns(null);
      const res = await UserGraqhQl.sendFriendRequest(
        { id: "1234" },
        "123",
        pubsub
      );
      expect(res.code).toEqual(200);
      expect(res.message).toEqual("Sent Friend Request!");
      expect(res.success).toEqual(true);
    });
    it("should not send if no user", async () => {
      const res = await UserGraqhQl.sendFriendRequest(
        null,
        { id: "1234" },
        pubsub
      );
      expect(res.code).toEqual(403);
      expect(res.message).toEqual("Not Logged In!");
      expect(res.success).toEqual(false);
    });
    it("should not send if no friend", async () => {
      const res = await UserGraqhQl.sendFriendRequest({}, null, pubsub);
      expect(res.code).toEqual(404);
      expect(res.message).toEqual("Friend Not Found!");
      expect(res.success).toEqual(false);
    });
    it("should not send if no friend or user found", async () => {
      sandbox.stub(User, "find").returns(false);
      const res = await UserGraqhQl.sendFriendRequest({}, "123", pubsub);
      expect(res.code).toEqual(404);
      expect(res.message).toEqual("User Not Found!");
      expect(res.success).toEqual(false);
    });
    it("should not send if friend and user are equal", async () => {
      const res = await UserGraqhQl.sendFriendRequest(
        { id: "123" },
        "123",
        pubsub
      );
      expect(res.code).toEqual(403);
      expect(res.message).toEqual("Can't Add Your Self!");
      expect(res.success).toEqual(false);
    });
    it("should not send if friend and user are already friends", async () => {
      sandbox.stub(pubsub, "publish").returns(null);
      sandbox
        .stub(User, "find")
        .onFirstCall()
        .returns({ id: "123", friendRequests: [], friends: ["1234"] })
        .onSecondCall()
        .returns({ id: "1234", friendRequests: [], friends: ["123"] });
      sandbox.stub(User.collection, "save").returns(null);
      const res = await UserGraqhQl.sendFriendRequest(
        { id: "1234" },
        "123",
        pubsub
      );
      expect(res.code).toEqual(403);
      expect(res.message).toEqual("Already Friends!");
      expect(res.success).toEqual(false);
    });
    it("should not send if there is a pending friend request", async () => {
      sandbox.stub(pubsub, "publish").returns(null);
      sandbox
        .stub(User, "find")
        .onFirstCall()
        .returns({ id: "123", friendRequests: ["1234"], friends: [] })
        .onSecondCall()
        .returns({ id: "1234", friendRequests: [], friends: [] });
      sandbox.stub(User.collection, "save").returns(null);
      const res = await UserGraqhQl.sendFriendRequest(
        { id: "1234" },
        "123",
        pubsub
      );
      expect(res.code).toEqual(403);
      expect(res.message).toEqual("You previous add request still pending!");
      expect(res.success).toEqual(false);
    });
  });
});
