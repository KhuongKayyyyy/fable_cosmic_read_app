import { mongoose } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { print, OutPutType } from "../helpers/print.js";
import HttpStatusCode from "../exceptions/HttpExceptionCode.js";
import { User } from "../models/index.js";

const login = async ({ email, password }) => {
  try {
    let existingUser = await User.findOne({ email: email }).exec();
    if (!existingUser) {
      print("User not found", OutPutType.ERROR);
      throw new Error("User not found");
    } else {

      const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordMatch) {
        print("Password is incorrect", OutPutType.ERROR);
        throw new Error("Password is incorrect");
      }
      
      let token = jwt.sign({ data: existingUser }, process.env.JWT_SECRET, {
        expiresIn: "10 days",
      });
      return {
        ...existingUser.toObject(),
        password: "Not shown",
        token,
      };
    }
  } catch (error) {
    print("Repository error: " + error.message, OutPutType.ERROR);
    throw new Error("Error while login: " + error.message);
  }
};

const register = async ({ name, email, password }) => {
  try {
    let existingUser = await User.findOne({ email: email }).exec();
    if (existingUser) {
      print("User already exists", OutPutType.ERROR);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS) || 10
    );
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    print("User created successfully", OutPutType.SUCCESS);
    return {
      ...newUser._doc,
      password: "Not shown",
    };
  } catch (error) {
    print("Repository error: " + error.message, OutPutType.ERROR);
    throw new Error("Error while register: "+error.message);
  }
};

const getUserById = async (id) => {
  try {
    let user = await User.findById(id).exec();
    if (!user) {
      print("User not found", OutPutType.ERROR);
      throw new Error("User not found");
    }
    return {
      ...user.toObject(),
      password: "Not shown",
    };
  } catch (error) {
    print("Repository error: " + error.message, OutPutType.ERROR);
    throw new Error("Error while getting user: " + error.message);
  }
};

export default {
  login,
  register,
  getUserById,
};
