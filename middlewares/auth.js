// middleware function to check if user is logged in
function checkAuth(req, res, next) {
  try {
    // get token from header
    const token = req.headers.authorization.split(" ")[1];

    // verify token
    const decodedToken = jwt.verify(token, "secret-key");

    // add userId to request object
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed",
    });
  }
}
module.exports = { checkAuth };