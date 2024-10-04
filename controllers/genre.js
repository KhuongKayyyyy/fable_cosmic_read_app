import { print,OutPutType } from "../helpers/print.js";
import { genreRepository } from "../repositories/index.js";
import HttpStatusCode from "../exceptions/HttpExceptionCode.js";
async function getAllGenre(req, res) {
    try {
        let genres = await genreRepository.getAllGenre();
        res.status(HttpStatusCode.OK).json({
            message: "All genres retrieved successfully", 
            data: genres,
        });
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: error.message });
        print("Controllers: "+ error.message, OutPutType.ERROR);
    }
}

async function getGenreById(req, res) {
    try{
        let id = req.params.id;
        let genre = await genreRepository.getGenreById(id);
        res.status(HttpStatusCode.OK).json({
            message: "Genre retrieved successfully",
            data: genre,
        });
    }catch(error){
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({message: error.message});
        print("Controllers: "+ error.message, OutPutType.ERROR);
    }
}

export default {
    getAllGenre,
    getGenreById,
}