import express from "express";
import { chapterController } from "../controllers/index.js";
const router = express.Router();

router.get("/", (req, res) => {
  chapterController.getAllChapters(req, res);
});

router.get("/:id", (req, res) => {
  chapterController.getChapterById(req, res);
});

export default router;