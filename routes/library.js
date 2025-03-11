import express from "express";
import { libraryController } from "../controllers/index.js";

const router = express.Router();

router.get("/:userId", (req, res) => {
    libraryController.getUserLibrary(req, res);
});

router.post("/:userId", (req, res) => {
    libraryController.addBookToLibrary(req, res);
});

router.delete("/:userId/:bookId", (req, res) => {
    libraryController.removeBookFromLibrary(req, res);
});

router.delete("/:userId", (req, res) => {
    libraryController.clearLibrary(req, res);
});

export default router;
