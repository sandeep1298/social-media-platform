const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true
        },
        postedBy: { type: ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
);

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    photo: {
        type: String,
        required: true
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [commentSchema],
    postedBy: {
        type: ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
