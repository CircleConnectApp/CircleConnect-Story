const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ 
      error: "Authorization header missing" 
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ 
      error: "Bearer token missing" 
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        error: "Token expired" 
      });
    }
    return res.status(401).json({ 
      error: "Invalid token" 
    });
  }
};

module.exports = authenticate;