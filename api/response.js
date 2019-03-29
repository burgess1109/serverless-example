module.exports = class Response {
  static success(body) {
    return {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  }

  static error(statusCode, message) {
    return {
      statusCode: statusCode || 500,
      body: JSON.stringify({
        message: message
      }),
    };
  }
};
