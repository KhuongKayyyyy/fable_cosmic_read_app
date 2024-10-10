import { print, OutPutType } from "../helpers/print.js";
import Genre from "../models/genre.js";
const getAllGenre = async (page, size, searchString = '') => {
  page = parseInt(page);
  size = parseInt(size);
  
  const skip = (page - 1) * size;

  try {
    if (searchString) {
      let filteredGenre = await Genre.aggregate([
        {
          $match: { name: { $regex: searchString, $options: "i" } },
        },
        {
          $skip: skip,
        },
        {
          $limit: size,
        },
      ]);

      let total = await Genre.countDocuments({ name: { $regex: searchString, $options: "i" } });
      
      return { genres: filteredGenre, total: total };
    } else {
      let genres = await Genre.find().skip(skip).limit(size);
      let total = await Genre.countDocuments(); // Get total number of genres

      return { genres: genres, total: total };
    }
  } catch (error) {
    print("Repository: " + error.message, OutPutType.ERROR);
    throw new Error(error.message);
  }
};

const getGenreById = async (id) => {
  try {
    return await Genre.findById(id);
  } catch (error) {
    print("Repository: " + error.message, OutPutType.ERROR);
    throw new Error(error.message);
  }
}
export default {
  getAllGenre,
  getGenreById,
};
