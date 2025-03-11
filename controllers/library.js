
import libraryRepository from "../repositories/library.js";
import HttpStatusCode from "../exceptions/HttpExceptionCode.js";

async function getUserLibrary(req, res) {
  try {
    let userId = req.params.userId;
    let library = await libraryRepository.getLibraryByUserId(userId);
    res.status(HttpStatusCode.OK).json({
      message: "Library retrieved successfully",
      data: library,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
}

async function addBookToLibrary(req, res) {
  try {
    let userId = req.params.userId;
    let bookId = req.body.bookId;
    let updatedLibrary = await libraryRepository.addBookToLibrary(userId, bookId);
    res.status(HttpStatusCode.OK).json({
      message: "Book added to library successfully",
      data: updatedLibrary,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
}

async function removeBookFromLibrary(req, res) {
  try {
    let userId = req.params.userId;
    let bookId = req.params.bookId;
    let updatedLibrary = await libraryRepository.removeBookFromLibrary(userId, bookId);
    res.status(HttpStatusCode.OK).json({
      message: "Book removed from library successfully",
      data: updatedLibrary,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
}

async function clearLibrary(req, res) {
  try {
    let userId = req.params.userId;
    await libraryRepository.clearLibrary(userId);
    res.status(HttpStatusCode.OK).json({
      message: "Library cleared successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
}

export default {
  getUserLibrary,
  addBookToLibrary,
  removeBookFromLibrary,
  clearLibrary,
};