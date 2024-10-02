import express from "express";
import {bookController} from "../controllers/index.js";
const router = express.Router();

router.get("/", (req, res) => {
    bookController.getAllBook(req, res);
});

router.get("/:id", (req, res) => {
    bookController.getBookById(req, res);
});

router.post("/", (req, res) => {
    res.send("You submitted a new book");
});

router.put("/:id", (req, res) => {
    res.send(`You updated the book with id ${req.params.id}`);
});
export default router;
