import express from "express";
import {genreController} from "../controllers/index.js";
const router = express.Router();

router.get("/", (req, res) => {
    genreController.getAllGenre(req, res);
});

router.get("/:id", (req, res) => { 
    genreController.getGenreById(req, res);
});
export default router;