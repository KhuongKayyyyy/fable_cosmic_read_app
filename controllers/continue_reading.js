import { continueReadingRepository } from "../repositories/index.js";
import HttpStatusCode from "../exceptions/HttpExceptionCode.js";

async function getContinueReading(req, res) {
  try {
    const { userId } = req.params;
    const continueReading = await continueReadingRepository.getContinueReadingByUser(userId);

    if (!continueReading) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: "No continue reading data found" });
    }

    res.status(HttpStatusCode.OK).json({
      message: "Continue reading data retrieved successfully",
      data: continueReading,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

async function addChapter(req, res) {
  try {
    const { userId } = req.params;
    const { bookId, chapterId } = req.body;

    if (!bookId || !chapterId) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Book ID and Chapter ID are required" });
    }

    const updatedData = await continueReadingRepository.addChapterToContinueReading(userId, bookId, chapterId);

    res.status(HttpStatusCode.CREATED).json({
      message: "Chapter added to continue reading successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

async function removeChapter(req, res) {
  try {
    const { userId } = req.params;
    const { chapterId } = req.body;
    

    const updatedData = await continueReadingRepository.removeChapterFromContinueReading(userId, chapterId);

    if (!updatedData) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: "Chapter not found in continue reading" });
    }

    res.status(HttpStatusCode.OK).json({
      message: "Chapter removed from continue reading successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

async function clearContinueReading(req, res) {
  try {
    const { userId } = req.params;

    await continueReadingRepository.clearContinueReading(userId);
    
    res.status(HttpStatusCode.OK).json({
      message: "Continue reading data cleared successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

async function isBookInContinueReading(req, res) {
  try {
    const { userId } = req.params;
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Book ID is required" });
    }

    const isInContinueReading = await continueReadingRepository.isBookInContinueReading(userId, bookId);

    res.status(HttpStatusCode.OK).json({
      message: "Book check in continue reading completed successfully",
      data: isInContinueReading ,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export default {
  getContinueReading,
  addChapter,
  removeChapter,
  clearContinueReading,
  isBookInContinueReading,
};
