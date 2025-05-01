import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // if token is not valid
    if (!token) {
      return res.status(401).json({
        msg: "Unauthorized user! Please login",
      });
    }

    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
        msg: error.message,
        data: {}
    })
  }
};

export default userAuth;
