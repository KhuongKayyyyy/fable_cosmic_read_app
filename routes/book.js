import express from "express";

const router = express.Router();
const { userController } = controllers;

router.get("/:id", (req, res) => {
    res.send(`You requested a book with id ${req.params.id}`);
});

router.get("/", (req, res) => {
    res.send("You requested a list of books");
});

router.post("/", (req, res) => {
    res.send("You submitted a new book");
});

router.put("/:id", (req, res) => {
    res.send(`You updated the book with id ${req.params.id}`);
});
export default router;
