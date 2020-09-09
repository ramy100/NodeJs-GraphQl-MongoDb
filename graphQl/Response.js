class GraphQlResponse {
  code;
  success;
  message;
  constructor(code, success, message) {
    this.code = code;
    this.success = success;
    this.message = message;
  }
}

class GraphQlResponseWithToken extends GraphQlResponse {
  token;
  user;
  constructor(code, success, message, token, user) {
    super();
    this.code = code;
    this.success = success;
    this.message = message;
    this.token = token;
    this.user = user;
  }
}
class GraphQlResponseWithChat extends GraphQlResponse {
  token;
  user;
  constructor(code, success, message, chatMessage) {
    super();
    this.code = code;
    this.success = success;
    this.message = message;
    this.chatMessage = chatMessage;
  }
}

module.exports = {
  GraphQlResponse,
  GraphQlResponseWithToken,
  GraphQlResponseWithChat,
};
