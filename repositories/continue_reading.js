import { ContinueReading } from "../models/index.js";
import mongoose from "mongoose";
async function getContinueReadingByUser(userId) {
  return await ContinueReading.findOne({ user: userId }).populate("chapters");
}

async function addChapterToContinueReading(userId, bookId, chapterId) {
  console.log("Inputs -> User:", userId, "Book:", bookId, "Chapter:", chapterId);

  if (!userId || !bookId || !chapterId) {
    throw new Error("Invalid input: userId, bookId, and chapterId are required.");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const bookObjectId = new mongoose.Types.ObjectId(bookId);
  const chapterObjectId = new mongoose.Types.ObjectId(chapterId);

  let continueReading = await ContinueReading.findOne({ user: userObjectId });

  if (continueReading) {
    console.log("ContinueReading entry found:", JSON.stringify(continueReading, null, 2));

    if (!Array.isArray(continueReading.chapters)) {
      continueReading.chapters = [];
    }

    // Find the book index inside the `chapters` array
    const bookIndex = continueReading.chapters.findIndex(
      (entry) => entry.book && entry.book.toString() === bookId
    );

    if (bookIndex !== -1) {
      console.log("Book found in continue reading. Replacing chapter...");

      // Replace the chapter for the existing book
      continueReading.chapters[bookIndex].chapter = chapterObjectId;
    } else {
      console.log("Book not found in continue reading. Adding new entry...");

      continueReading.chapters.push({
        book: bookObjectId,
        chapter: chapterObjectId
      });
    }

    await continueReading.save();
  } else {
    console.log("No ContinueReading entry found. Creating a new one...");

    continueReading = await ContinueReading.create({
      user: userObjectId,
      chapters: [
        {
          book: bookObjectId,
          chapter: chapterObjectId
        }
      ]
    });
  }

  return await ContinueReading.findById(continueReading._id)
    .populate("chapters.book")
    .populate("chapters.chapter");
}


async function removeChapterFromContinueReading(userId, chapterId) {
  return await ContinueReading.findOneAndUpdate(
    { user: userId },
    { $pull: { chapters: { chapter: chapterId } } },
    { new: true }
  )
    .populate("chapters.book")
    .populate("chapters.chapter");
}

async function clearContinueReading(userId) {
  return await ContinueReading.findOneAndDelete({ user: userId });
}

export default {
  getContinueReadingByUser,
  addChapterToContinueReading,
  removeChapterFromContinueReading,
  clearContinueReading,
};
