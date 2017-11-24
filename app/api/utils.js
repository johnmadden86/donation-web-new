exports.getUserIdFromRequest = function (request) {
  let userId = null;
  try {
    const authorization = request.headers.authorization;
    const token = authorization.split(' ')[1];
    const userId = decodedToken.id;
  } catch (e) {
    userId = null;
  }

  return userId;
};
