import { print, OutPutType } from "../helpers/print.js";
import Genre from "../models/genre.js";
const getAllGenre = async (searchString ='') => {
  if (searchString) {
    try {
      return await Genre.findOne({name: { $regex: searchString, $options: 'i' }});
    } catch (error) {
      print("Repository: " + error.message, OutPutType.ERROR);
      throw new Error(error.message);
    }
  }
  try {
    return await Genre.find();
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
