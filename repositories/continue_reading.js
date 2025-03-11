import { ContinueReading } from "../models/index.js";
async function getContinueReadingByUser(userId) {
  return await ContinueReading.findOne({ user: userId }).populate("chapters");
}

async function addChapterToContinueReading(userId, chapterId) {
  return await ContinueReading.findOneAndUpdate(
    { user: userId },
    { $addToSet: { chapters: chapterId } }, // Prevents duplicate entries
    { new: true, upsert: true } // Create if not found
  ).populate("chapters");
}

async function removeChapterFromContinueReading(userId, chapterId) {
  return await ContinueReading.findOneAndUpdate(
    { user: userId },
    { $pull: { chapters: chapterId } }, // Remove specific chapter
    { new: true }
  ).populate("chapters");
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
