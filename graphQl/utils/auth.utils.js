const jwt = require("jsonwebtoken");

class AuthFunctions {
  static getToken({ id, username, email }) {
    return jwt.sign(
      {
        id,
        username,
        email,
      },
      process.env.SECRET,
      { expiresIn: "1d" }
    );
  }

  static VerifyToken(token) {
    try {
      const user = jwt.verify(token, process.env.SECRET);
      return user;
    } catch (error) {
      return undefined;
    }
  }
}

module.exports = AuthFunctions;
