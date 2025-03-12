import { Library } from "../models/index.js";

/**
 * Get a user's library by user ID.
 */
const getLibraryByUserId = async (userId) => {
    try {
        const library = await Library.findOne({ user: userId }).populate("books");
    //     const library = await Library.findOne({ user: userId })
    // .populate("books", "_id title author"); // Selects only specific field
    // or we can remove the second argument to select all fields
    // or we can remove the whol populate method to get only the book ids
        if (!library) {
            throw new Error("Library not found");
        }
        return library.books;
    } catch (error) {
        console.log("Error getting library:", error.message);
        throw new Error(error.message);
    }
};

/**
 * Add a book to the user's library.
 */
const addBookToLibrary = async (userId, bookId) => {
    try {
        let library = await Library.findOne({ user: userId });

        if (!library) {
            library = new Library({ user: userId, books: [] });
        }

        if (!library.books.includes(bookId)) {
            library.books.push(bookId);
            await library.save();
        }

        return library;
    } catch (error) {
        console.log("Error adding book to library:", error.message);
        throw new Error(error.message);
    }
};

/**
 * Remove a book from the user's library.
 */
const removeBookFromLibrary = async (userId, bookId) => {
    try {
        const library = await Library.findOne({ user: userId });

        if (!library) {
            throw new Error("Library not found");
        }

        library.books = library.books.filter(id => id.toString() !== bookId);
        await library.save();

        return library;
    } catch (error) {
        console.log("Error removing book from library:", error.message);
        throw new Error(error.message);
    }
};

/**
 * Clear all books from the user's library.
 */
const clearLibrary = async (userId) => {
    try {
        const library = await Library.findOne({ user: userId });

        if (!library) {
            throw new Error("Library not found");
        }

        library.books = [];
        await library.save();

        return library;
    } catch (error) {
        console.log("Error clearing library:", error.message);
        throw new Error(error.message);
    }
};


/**
 * Check if a book is in the user's library.
 */
const isBookInLibrary = async (userId, bookId) => {
    try {
        const library = await Library.findOne({ user: userId });

        if (!library) {
            throw new Error("Library not found");
        }

        return library.books.includes(bookId);
    } catch (error) {
        console.log("Error checking if book is in library:", error.message);
        throw new Error(error.message);
    }
};

export default {
    getLibraryByUserId,
    addBookToLibrary,
    removeBookFromLibrary,
    clearLibrary,
    isBookInLibrary
};
