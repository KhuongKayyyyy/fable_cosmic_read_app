import mongoose from 'mongoose';

// Define the Book schema
const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    genres: {
        type: [String],
        ref: 'Genre'
    },
    viewCount: {
        type: Number,
        default: 0
    },
    author: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Hoàn Thành', 'Đang tiến hành', 'Tạm ngưng'],
        required: true
    },
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    }]
}, {
    timestamps: true
});

// Create the Book model
const Book = mongoose.model('Book', bookSchema);

export default Book;
