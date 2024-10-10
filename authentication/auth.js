import jwt from "jsonwebtoken";

export default function checkToken(req, res, next) {
  const allowedPaths = [
    "/user/login",
    "/user/register",
    "/books",
    "/genres",
    "/chapters",
  ];

  // Bypass login and register
  if (allowedPaths.includes(req.path.toLowerCase())) {
    next();
    return;
}

  // Get and validate the token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
    const isExpired = new Date(jwtObject.exp * 1000) < new Date();
    if (isExpired) {
      return res.status(401).json({ message: "Token is expired" });
    }
    req.user = jwtObject.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
}
