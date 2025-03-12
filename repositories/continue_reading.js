import { ContinueReading } from "../models/index.js";
import mongoose from "mongoose";
import { chapterRepository } from "./index.js";
async function getContinueReadingByUser(userId) {
  const continueReading = await ContinueReading.findOne({ user: userId })
    .populate({
      path: "chapters",
      select: "chapter book", // Ensure `chapter` is included
      populate: {
        path: "book",
        select: "name author thumbnail",
      },
    });

  if (!continueReading || !continueReading.chapters) return null;

  return Promise.all(continueReading.chapters.map(async (entry) => {
    // Fetch chapter details
    const tempChapter = await chapterRepository.getChapterById(entry.chapter);

    return {
      bookId: entry.book?._id || "Unknown",
      chapterId: entry.chapter?._id || "Unknown",
      chapterName: tempChapter?.title || "Unknown",
      bookName: entry.book?.name || "Unknown",
      bookAuthor: entry.book?.author || "Unknown",
      bookImage: entry.book?.thumbnail || null,
    };
  }));
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

      // Move this entry to the beginning of the list
      const updatedEntry = continueReading.chapters.splice(bookIndex, 1)[0];
      continueReading.chapters.unshift(updatedEntry);
    } else {
      console.log("Book not found in continue reading. Adding new entry at the beginning...");

      continueReading.chapters.unshift({
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

async function isBookInContinueReading(userId, bookId) {
  const continueReading = await ContinueReading.findOne({ user: userId, "chapters.book": bookId })
    .populate({
      path: "chapters.book",
      select: "name author thumbnail", // Fetch book details
    });

  if (!continueReading || !continueReading.chapters) return null;

  // Find the specific book entry
  const entry = continueReading.chapters.find((entry) => entry.book?._id.toString() === bookId);

  if (!entry) return null;

  // Fetch chapter details
  const tempChapter = await chapterRepository.getChapterById(entry.chapter);

  return {
    bookId: entry.book?._id.toString() || "Unknown",
    chapterId: entry.chapter?._id.toString() || "Unknown",
    chapterName: tempChapter?.title || "Unknown",
    bookName: entry.book?.name || "Unknown",
    bookAuthor: entry.book?.author || "Unknown",
    bookImage: tempChapter?.pages[1] || null,
  };
}


export default {
  getContinueReadingByUser,
  addChapterToContinueReading,
  removeChapterFromContinueReading,
  clearContinueReading,
  isBookInContinueReading,
};
