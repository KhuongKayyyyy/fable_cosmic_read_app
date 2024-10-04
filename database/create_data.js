import dotenv from "dotenv";
dotenv.config();
import connect from "./database.js";
import { Genre, Book } from "../models/index.js";

async function updateBookGenres() {
    try {
        await connect();
        console.log("Connected to the database.");

        const genres = await Genre.find().limit(4);
        if (genres.length < 4) {
            console.error("Not enough genres found. At least 4 genres are required.");
            return;
        }

        const genreIds = genres.map(genre => genre._id);
        console.log("Genre IDs to be set:", genreIds);

        const result = await Book.updateMany({}, { $set: { genres: genreIds } });
        console.log(`${result.modifiedCount} books' genre property populated with the first 4 genres.`);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

updateBookGenres();
