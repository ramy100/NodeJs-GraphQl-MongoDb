const sinon = require("sinon");
const { MessagesGraphQl } = require("../Messages/Message");
const MessageModel = require("../Messages/Message.model");
const UserModel = require("../Users/User.model");
const sandbox = sinon.createSandbox();
describe("Messages Tests", () => {
  describe("send messages", () => {
    const friendId = "456";
    const userId = "123";
    afterEach(() => {
      sandbox.restore();
    });
    it("should send message if friends", async () => {
      sandbox.stub(MessageModel.collection, "save").returns(true);
      sandbox
        .stub(UserModel, "find")
        .onCall(0)
        .returns({ friends: [friendId] })
        .onCall(1)
        .returns({ friends: [userId] });
      const res = await MessagesGraphQl.sendMessage(userId, friendId, "soso");
      expect(res.code).toEqual(200);
      expect(res.success).toEqual(true);
      expect(res.message).toEqual("Message Sent Successfully!");
    });

    it("should not send message if no friend or user provided", async () => {
      const res = await MessagesGraphQl.sendMessage(userId, null, "soso");
      expect(res.code).toEqual(404);
      expect(res.success).toEqual(false);
      expect(res.message).toEqual("User Not Found!");
      const res2 = await MessagesGraphQl.sendMessage(null, friendId, "soso");
      expect(res2.code).toEqual(404);
      expect(res2.success).toEqual(false);
      expect(res2.message).toEqual("User Not Found!");
    });

    it("should not send message if user or friend not found", async () => {
      sandbox.stub(UserModel, "find").returns(false);
      const res = await MessagesGraphQl.sendMessage(userId, friendId, "soso");
      expect(res.code).toEqual(404);
      expect(res.success).toEqual(false);
      expect(res.message).toEqual("User Not Found!");
    });

    it("should not send message if not friends", async () => {
      sandbox.stub(MessageModel.collection, "save").returns(true);
      sandbox
        .stub(UserModel, "find")
        .onCall(0)
        .returns({ friends: [] })
        .onCall(1)
        .returns({ friends: [] });
      const res = await MessagesGraphQl.sendMessage(userId, friendId, "soso");
      expect(res.code).toEqual(403);
      expect(res.success).toEqual(false);
      expect(res.message).toEqual("You Are Not Friends!");
    });
  });

  describe("read messages", () => {
    it("should not read other users messages", async () => {});
  });
});
