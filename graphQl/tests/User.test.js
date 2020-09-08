const { UserGraqhQl, standAloneFunctions } = require("../Users/User");
const sinon = require("sinon");
require("dotenv").config();
const bcrypt = require("bcryptjs");

describe("User Model Test", () => {
  describe("Register", () => {
    const validRegisterUser = {};
    beforeEach(() => {
      validRegisterUser.username = "ramy";
      validRegisterUser.email = "r@r.com";
      validRegisterUser.password = "123456";
      validRegisterUser.confirmPassword = "123456";
    });

    it("should register a user", async () => {
      const mockGetUserEmail = sinon
        .stub(standAloneFunctions, "getUserByEmail")
        .returns(false);
      const mockSaveUser = sinon
        .stub(standAloneFunctions, "saveUser")
        .callsFake((args) => ({
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
      mockGetUserEmail.restore();
      mockSaveUser.restore();
    });

    it("should not register if User already exists", async () => {
      const mockGetUserEmail = sinon
        .stub(standAloneFunctions, "getUserByEmail")
        .returns(true);
      const res = await UserGraqhQl.registerNewUser(validRegisterUser);
      expect(res.code).toEqual(403);
      expect(res.success).toEqual(false);
      expect(res.message).toEqual("User Already Exists!");
      mockGetUserEmail.restore();
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
    it("should login User", async () => {
      const mockGetUserByEmail = sinon
        .stub(standAloneFunctions, "getUserByEmail")
        .returns(true);
      const bcryptStub = sinon.stub(bcrypt, "compare").returns(true);
      const res = await UserGraqhQl.login(ValidLoginUser);
      expect(res.code).toEqual(200);
      mockGetUserByEmail.restore();
      bcryptStub.restore();
    });

    it("should not login User if wrong password", async () => {
      const mockGetUserByEmail = sinon
        .stub(standAloneFunctions, "getUserByEmail")
        .returns(true);
      const bcryptStub = sinon.stub(bcrypt, "compare").returns(false);
      const res = await UserGraqhQl.login(ValidLoginUser);
      expect(res.code).toEqual(403);
      mockGetUserByEmail.restore();
      bcryptStub.restore();
    });

    it("should not login User if wrong email", async () => {
      const mockGetUserByEmail = sinon
        .stub(standAloneFunctions, "getUserByEmail")
        .returns(false);
      const res = await UserGraqhQl.login(ValidLoginUser);
      expect(res.code).toEqual(404);
      mockGetUserByEmail.restore();
    });
  });
});
