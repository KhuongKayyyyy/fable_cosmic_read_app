import mongoose from 'mongoose';

// Define the Library schema
const librarySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true,
        unique: true  // Ensures each user has only one library
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'  // Reference to the Book model
    }]
}, {
    timestamps: true  // Keeps track of when books are added/removed
});

// Create the Library model
const Library = mongoose.model('Library', librarySchema);

export default Library;
