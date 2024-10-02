import { print, OutPutType } from "../helpers/print.js";
import HttpStatusCode from "../exceptions/HttpExceptionCode.js";
import { MAX_BOOKS_PER_PAGE } from "../global/constant.js";
import {bookRepository} from "../repositories/index.js";
async function getAllBook(req, res) {
  try {
    let {page = 1, size = MAX_BOOKS_PER_PAGE, searchString = '',genre =''} = req.query;
    size = size > MAX_BOOKS_PER_PAGE ? MAX_BOOKS_PER_PAGE : size;
    let filteredBooks = await bookRepository.getAllBook(page, size, searchString,genre);
    res.status(HttpStatusCode.OK).json(
        {
            message: "Books retrieved successfully",
            page: page,
            size: size,
            searchString: searchString,
            data: filteredBooks,
        }
    );
    return filteredBooks
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send({ message: error.message });
    print(error.message, OutPutType.ERROR);
  }
}

export default {
    getAllBook
}
