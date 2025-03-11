import mongoose from "mongoose";

const continueReadingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, 
    },
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        required: true,
    }]
}, {
    timestamps: true, 
});

const ContinueReading = mongoose.model("ContinueReading", continueReadingSchema);
export default ContinueReading;
