import { parse } from "dotenv";
import { print, OutPutType } from "../helpers/print.js";
import Chapter from "../models/chapter.js";
const insertChapter = async (title, imageList) => {};

const getAllChapters = async (page, size, searchString) => {
  page = parseInt(page);
  size = parseInt(size);
  try {
    let filteredChapters = await Chapter.aggregate({
    })
      .skip((page - 1) * size)
      .limit(size);
    return filteredChapters;
  } catch (error) {
    print("Repository: " + error.message, OutPutType.ERROR);
  }
};

const getChapterById = async (id) => {
  try {
    return await Chapter.findById(id);
  } catch (error) {
    print("Repository: " + error.message, OutPutType);
  }
};
export default {
  insertChapter,
  getAllChapters,
  getChapterById,
};
