import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import {validateSignUpData} from "../utils/validate.js";
import validator from "validator";

class UserController {
  // LOGIN the USER
  static login = async (req, res) => {
    try {
      // GET the email, password from the REQ BODY
      const { email, password } = req.body;

      // VALIDATE EMAIL
      if (!validator.isEmail(email)) throw new Error("Email id is not valid");

      // FIND the USER
      const user = await User.findOne({ email });
      // IF NOT EXIST THROW an ERROR
      if (!user) throw new Error("Invalid crendentails");

      // VALIDATE the PASSWORD5
      const isPasswordValid = await user.validatePassword(password);
      // THROW ERROR if PASSWORD is not VALID
      if (!isPasswordValid) throw new Error("Invalid Crendentails");

      // get the jwt token
      const token = user.getJWT();

      const userObj = user.toObject();
      // make sure to DELETE the PASSWORD FIELD
      delete userObj.password;

      // set token in res cookies
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000),
      });

      // send back the response
      res.status(200).json({
        msg: "Login Successfully",
        success: true,
        data: userObj
      });
    } catch (error) {
      res.status(400).json({
        msg: error.message,
        success: false,
        data: {}
      });
    }
  };

  // REGISTER the USER
  static register = async (req, res) => {
    console.log("Inside register")
    try {
      // VALIDATE the DATA
      validateSignUpData(req);

      // GET the USER DETAILS
      let { name, email, password, country } = req.body;

      // CHECK if USER already EXIST
      const isUserExist = await User.findOne({
        email,
      });

      // // IF YES then throw an ERROR
      if (isUserExist) {
        throw new Error("User already exist");
      }

      // ENCRYPT the PASSWORD
      const passswordHash = await bcrypt.hash(password, 10);

      // CREATE USER OBJECT by using USER MODEL
      const user = new User({
        name,
        email,
        password: passswordHash,
        country
      });

      // ADD the USER into the DATABASE
      const registeredUser = await user.save();

      // GET the TOKEN
      const token = await registeredUser.getJWT();

      // SET the TOKEN inside COOKIES
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000),
      });

      // send back the response
      res.status(200).json({
        msg: "User Added: successfully",
        success: true,
        data: registeredUser,
      });

    } catch (error) {
      res.status(400).json({
        msg: error.message,
        success: false,
        data: {},
      });
    }
  };
}

export default UserController;
