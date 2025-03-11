import { body, validationResult } from "express-validator";
import { print, OutPutType } from "../helpers/print.js";
import { userRepository } from "../repositories/index.js";
import { EventEmitter } from "node:events";

const myEvent = new EventEmitter();

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const loginResult = await userRepository.login({ email, password });

    if (loginResult.error) {
      res.status(400).json({ message: loginResult.error });
    }
    res.status(200).json({ message: "Login successful", data: loginResult });
  } catch (error) {
    print("Controller error: " + error.message, OutPutType.ERROR);
    res.status(500).send({
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    const registerResult = await userRepository.register({ name, email, password });

    if (registerResult.error) {
      res.status(400).json({ message: registerResult.error });
    }
    res.status(201).json({ message: "Register successful", data: registerResult });
  } catch (error) {
    print("Controller error: " + error.message, OutPutType.ERROR);
    res.status(500).send({ message: error.message });
  }
}

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userRepository.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({message: "User found", data: user });
  } catch (error) {
    print("Controller error: " + error.message, OutPutType.ERROR);
    res.status(500).send({ message: error.message });
  }
};
export default{
    login,
    register,
    getUserById,
}
