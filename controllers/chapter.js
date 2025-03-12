import HttpStatusCode from "../exceptions/HttpExceptionCode.js";
import { print, OutPutType } from "../helpers/print.js";
import { bookRepository, chapterRepository } from "../repositories/index.js";
import { MAX_BOOKS_PER_PAGE } from "../global/constant.js";
async function getAllChapters(req, res) {
  try {
    let {page = 1, size = MAX_BOOKS_PER_PAGE, searchString = ''} = req.query;
    size = size > MAX_BOOKS_PER_PAGE ? MAX_BOOKS_PER_PAGE : size;
    let filteredChapters = await chapterRepository.getAllChapters(page, size, searchString);
    res.status(HttpStatusCode.OK).json({
      message: "All chapters retrieved successfully",
      page: page,
      size: size,
      searchString: searchString,
      data: filteredChapters,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
    print("Controllers: " + error.message, OutPutType.ERROR);
  }
}

async function getChapterById(req, res) {
  try {
    let id = req.params.id;
    let chapter = await chapterRepository.getChapterById(id);
    res.status(HttpStatusCode.OK).json({
      message: "Chapter retrieved successfully",
      data: chapter,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
}

async function getChapterWithBookImage(req, res) {
  try {
    let id = req.params.id;
    let chapter = await chapterRepository.getChapterById(id);

    if (!chapter) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Chapter not found",
      });
    }

    let bookData = await bookRepository.getBookById(chapter.book);

    res.status(HttpStatusCode.OK).json({
      message: "Chapter with book image retrieved successfully",
      data: {
        chapterTitle: chapter.title,
        bookImage: bookData.thumbnail,
        bookTitle: bookData.name,
        bookAuthor: bookData.author,
      },
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
}

export default{ getAllChapters ,getChapterById,getChapterWithBookImage};
