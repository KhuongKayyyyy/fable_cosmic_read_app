import { print, OutPutType } from "../helpers/print.js";
import HttpStatusCode from "../exceptions/HttpExceptionCode.js";
import { MAX_BOOKS_PER_PAGE } from "../global/constant.js";
import { bookRepository } from "../repositories/index.js";
import { get } from "mongoose";
async function getAllBook(req, res) {
  try {
    let {
      page = 1,
      size = MAX_BOOKS_PER_PAGE,
      searchString = "",
      genre = "",
    } = req.query;
    size = size > MAX_BOOKS_PER_PAGE ? MAX_BOOKS_PER_PAGE : size;
    let filteredBooks = await bookRepository.getAllBook(
      page,
      size,
      searchString,
      genre
    );
    res.status(HttpStatusCode.OK).json({
      message: "Books retrieved successfully",
      page: page,
      size: size,
      searchString: searchString,
      data: filteredBooks,
    });
    return filteredBooks;
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
    print(error.message, OutPutType.ERROR);
  }
}
async function getBookById(req, res) {
  try {
    let id = req.params.id;
    let book = await bookRepository.getBookById(id);
    res.status(HttpStatusCode.OK).json({
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
}

async function getBookChapters(req, res) {
  try {
    let id = req.params.id;
    let { page = 1, size = MAX_BOOKS_PER_PAGE } = req.query;
    let book = await bookRepository.getBookChapters(id, page, size);
    res.status(HttpStatusCode.OK).json({
      message: "Book chapters retrieved successfully",
      data: book.chapters,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
}

async function getBookGenres(req, res) {
  try {
    let id = req.params.id;
    let book = await bookRepository.getBookGenres(id);
    res.status(HttpStatusCode.OK).json({
      message: "Book genres retrieved successfully",
      data: book.genres,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
}

async function getBookByGenre(req, res) {
  try {
    let genre = req.params.genre;
    let books = await bookRepository.getBookByGenre(genre);
    res.status(HttpStatusCode.OK).json({
      message: "Books retrieved successfully",
      data: books,
    });
  }catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
}

async function getBookByName(req, res) {
  try {
    let name = req.params.name;
    let books = await bookRepository.getBookByName(name);
    res.status(HttpStatusCode.OK).json({
      message: "Books retrieved successfully",
      size: books.length,
      data: books,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
}

export default {
  getAllBook,
  getBookById,
  getBookChapters,
  getBookGenres,
  getBookByGenre,
  getBookByName,
};
