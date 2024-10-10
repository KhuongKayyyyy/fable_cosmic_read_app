import { print, OutPutType } from "../helpers/print.js";
import { genreRepository } from "../repositories/index.js";
import HttpStatusCode from "../exceptions/HttpExceptionCode.js";
import { MAX_BOOKS_PER_PAGE } from "../global/constant.js";
async function getAllGenre(req, res) {
  try {
    let { page = 1, size = MAX_BOOKS_PER_PAGE, searchString = "" } = req.query;
    page = parseInt(page);
    size = parseInt(size);
    size = size > MAX_BOOKS_PER_PAGE ? MAX_BOOKS_PER_PAGE : size;

    let genres = await genreRepository.getAllGenre(page, size, searchString);
    res.status(HttpStatusCode.OK).json({
      message: "All genres retrieved successfully",
      page: page,
      size: size,
      searchString: searchString,
      data: genres.genres,
      total: genres.total,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
    print("Controllers: " + error.message, OutPutType.ERROR);
  }
}


async function getGenreById(req, res) {
  try {
    let id = req.params.id;
    let genre = await genreRepository.getGenreById(id);
    res.status(HttpStatusCode.OK).json({
      message: "Genre retrieved successfully",
      data: genre,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
    print("Controllers: " + error.message, OutPutType.ERROR);
  }
}

async function getGenreByName(req, res) {
  try {
    let name = req.params.name;
    let genre = await genreRepository.getGenreByName(name);
    res.status(HttpStatusCode.OK).json({
      message: "Genre retrieved successfully",
      data: genre,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
  }
}
export default {
  getAllGenre,
  getGenreById,
};
