const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    userId: {type: String, required: true}, 
    bookId: {type: String, required: true},  
    bookName: {type: String, default: null},  
    amount: {type: Number, default: 0},  
    quantity: {type: Number, default: 1},
    paymet: { type: Boolean, default: false } 
})

module.exports = mongoose.model("Cart", cartSchema)