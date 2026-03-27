const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    title: { type: String, required: true },
    version: { type: String, default: "1" },
    description: { type: String },
    category: { type: String },
    publishedDate: { type: Date },
    pages: { type: Number },
    language: { type: String, default: "English" },
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("book", bookSchema)