import express from "express";
import { continueReadingController } from "../controllers/index.js";

const router = express.Router();

router.get("/:userId", continueReadingController.getContinueReading);
router.put("/:userId/add", continueReadingController.addChapter);
router.put("/:userId/remove", continueReadingController.removeChapter);
router.delete("/:userId", continueReadingController.clearContinueReading);

export default router;
