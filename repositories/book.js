import mongoose, { get } from "mongoose";
import { Book } from "../models/index.js";

const getAllBook = async (page, size, searchString, genre) => {
    page = parseInt(page);
    size = parseInt(size);

    let matchCondition = {};
    if (searchString) {
        matchCondition.$or = [
            { name: { $regex: searchString, $options: "i" } },
            { author: { $regex: searchString, $options: "i" } },
        ];
    }
    if (genre) {
        matchCondition.genre = genre;
    }
    let filteredBook = await Book.aggregate([
        {
            $match: matchCondition,
        },
        {
            $skip: (page - 1) * size,
        },
        {
            $limit: size,
        },
    ]);

    return filteredBook;
};
const getBookById = async (id) => {
    try {
        const book = await Book.findById(id);
        if (!book) {
            throw new Error("Book not found");
        }
        return book;
    } catch (error) {
        console.log("Error getting book by id:", error.message);
        throw new Error(error.message);
    }
}

const insertBook = async ({
    name,
    thumbnail,
    genres,
    viewCount,
    likeCount,
    followCount,
    author,
    introduction,
    status,
    chapters,
}) => {
    try {
        const existingBook = await Book.findOne({ name });
        if (existingBook) {
            throw new Error("Book already exists");
        }

        const book = new Book({
            name,
            thumbnail,
            genres,
            viewCount: parseInt(viewCount) || 0,
            likeCount: parseInt(likeCount) || 0,
            followCount: parseInt(followCount) || 0,
            author,
            introduction,
            status: status || "Đang tiến hành",
            chapters,
        });

        await book.save();
        return book;
    } catch (error) {
        console.log("Error inserting book:", error.message);
        throw new Error(error.message);
    }
};

const getBookChapters = async (id, page, size) => {
    page = parseInt(page);
    size = parseInt(size);
    try {
        const book = await Book.findById(id).populate("chapters");
        return book
    } catch (error) {
        console.log("Error getting book chapters by id: ",error.message);
        throw new Error(error.message);
    }
}

const getBookGenres = async (id) => {
    try{
        const book = await Book.findById(id).populate("genres");
        return book
    }catch(error){
        console.log("Error getting book genres: ",error.message);
        throw new Error(error.message);
    }
}

const getBookByGenre = async (genre) => {
    try{
        const book = await Book.find({genres: genre});
        return book
    }catch(error){
        console.log("Error getting book by genre: ",error.message);
        throw new Error(error.message);
    }
}

const getBookByName = async (name) => {
    try {
        const book = await Book.find({ name: { $regex: name, $options: "i" } });
        if (!book) {
            throw new Error("Book not found");
        }
        return book;
    } catch (error) {
        console.log("Error getting book by name:", error.message);
        throw new Error(error.message);
    }
};

export default {
    getAllBook,
    getBookById,
    insertBook,
    getBookChapters,
    getBookGenres,
    getBookByGenre,
    getBookByName,
}
