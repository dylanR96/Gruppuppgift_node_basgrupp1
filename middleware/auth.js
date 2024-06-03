// Middleware för att autentisera användare
const authenticate = (req, res, next) => {
  if (global.currentUser) {
    req.user = global.currentUser;
    console.log("Authenticated user:", {
      id: req.user.id,
      username: req.user.username,
    });
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      status: 401,
    });
  }
};

export default authenticate;
