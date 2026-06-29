import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/userModel.js";
import { refreshToken } from "../controllers/authController.js";

export const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(errorHandler(403, "bad request no header provided"));
  }

  const refreshToken = req.headers.authorization.split(" ")[1].split(",")[0];
  const accessToken = req.headers.authorization.split(" ")[1].split(",")[1];

  if (!accessToken) {
    if (!refreshToken) {
      return next(errorHandler(401, "You are not authenticated"));
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
      const user = await User.findById(decoded.id);

      if (!user) return next(errorHandler(403, "Invalid refresh token"));

      if (user.refreshToken !== refreshToken)
        return next(errorHandler(403, "Invalid refresh token"));

      const newAccessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN,
        { expiresIn: "15m" },
      );
      const newRefreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN,
        { expiresIn: "7d" },
      );
      await User.updateOne(
        { _id: user._id },
        { refreshToken: newRefreshToken },
      );

      req.user = decoded.id;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  } else {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      req.user = decoded.id;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        if (!refreshToken) {
          return next(errorHandler(401, "You are not authenticated"));
        }
      } else {
        next(errorHandler(403, "Token is not valid"));
      }
    }
  }
};
