import dotenv from "dotenv";
dotenv.config();
import connect from "./database.js";
import { Genre, Book,Chapter } from "../models/index.js";

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

// updateBookGenres();

// updateChaptersWithBookId();
async function updateFirst20ChaptersWithSingleBookId() {
    try {
        await connect();
        console.log("Connected to the database.");

        const book = await Book.findOne();
        if (!book) {
            console.error("No book found.");
            return;
        }

        // Count chapters without bookId
        const chaptersWithoutBookId = await Chapter.countDocuments({ bookId: { $exists: false } });
        console.log(`${chaptersWithoutBookId} chapters found without bookId.`);

        // Fetch the first 20 chapters without bookId
        const chaptersToUpdate = await Chapter.find({ bookId: { $exists: false } }).limit(20);
        
        // Update each chapter individually
        const updatePromises = chaptersToUpdate.map(async (chapter) => {
            chapter.bookId = book._id; // Set the bookId
            await chapter.save(); // Save the updated chapter
        });
        
        await Promise.all(updatePromises); // Wait for all updates to complete
        console.log(`${chaptersToUpdate.length} chapters updated with bookId ${book._id}.`);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

updateFirst20ChaptersWithSingleBookId();