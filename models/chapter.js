import mongoose from "mongoose";

// Define the Chapter schema
const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,  // Chapter name is required
    },
    pages: {
        type: [String],  // Array of strings to represent the list of image URLs or paths
        required: true,  // At least one image is required
    }
}, {
    timestamps: true  // Automatically creates `createdAt` and `updatedAt` fields
});

// Create the Chapter model
const Chapter = mongoose.model('Chapter', chapterSchema);

export default Chapter;
