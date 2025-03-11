import express from "express";
import {bookController} from "../controllers/index.js";
const router = express.Router();

router.get("/", (req, res) => {
    bookController.getAllBook(req, res);
});

router.get("/:id", (req, res) => {
    bookController.getBookById(req, res);
});

router.get("/:id/chapters", (req, res) => {
    bookController.getBookChapters(req, res);
});

router.get("/:id/genres",(req,res)=>{
    bookController.getBookGenres(req,res);
});

router.get("/genre/:genre",(req,res)=>{
    bookController.getBookByGenre(req,res);
});

router.post("/", (req, res) => {
    bookController.insertBook(req, res);
});

router.put("/:id", (req, res) => {
    res.send(`You updated the book with id ${req.params.id}`);
});

router.get("/search/:name", (req, res) => {
    bookController.getBookByName(req, res);
});

export default router;
