const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User");

/**
 * @swagger
 * /api/book/addBook:
 *   post:
 *     summary: Add book
 *     tags: [Book]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookName
 *               - author
 *               - price
 *               - title
 *               - description
 *               - category
 *               - publishedDate
 *               - pages
 *               - stock
 *             properties:
 *               bookName:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               publishedDate:
 *                 type: string
 *               pages:
 *                 type: number
 *               stock:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book added successfully
 */

router.post("/addBook", async (req, res) => {
    try {

        const { bookName, author, price, title, description, category, publishedDate, pages, stock } = req.body;
        const bookLowerCase = bookName.toLowerCase();
        let book = await Book.findOne({ bookName: bookLowerCase });
        if (book) {
            return res.status(400).json({ msg: "Book already exists" });
        }

        book = new Book({
            bookName: bookLowerCase,
            author,
            price,
            title,
            description,
            category,
            publishedDate,
            pages,
            stock
        })
        book.save();
        return res.status(200).json({ msg: "Book added exists", book });

    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
})


/**
 * @swagger
 * /api/book/addFavouriteBook:
 *   post:
 *     summary: Add favourite book
 *     tags: [Book]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *             properties:
 *               userId:
 *                 type: string
 *               bookId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book added successfully
 */

router.post("/addFavouriteBook", async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        const user = await User.findById(userId);

        // Check if the book is already in the favourites
        if (user.favouriteBookId.includes(bookId)) {
            return res.status(400).json({ msg: "Book already in favourites" });
        }

        user.favouriteBookId.push(bookId);
        await user.save();
        // res.status(200).json({ msg: "Favourite book added successfully" });
        res.status(200).json({ msg: "Favourite book added successfully", favouriteBooks: user.favouriteBookId });


    } catch (err) {
        res.status(500).json({ msg: "Server error", err });
    }
})


/**
 * @swagger
 * /api/book/removeFavouriteBook:
 *   post:
 *     summary: Remove favourite book
 *     tags: [Book]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *             properties:
 *               userId:
 *                 type: string
 *               bookId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book removed successfully
 */

router.post("/removeFavouriteBook", async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(400).json({ msg: "Book not found" });
        }

        if (user.favouriteBookId.includes(bookId)) {
            user.favouriteBookId = user.favouriteBookId.filter(
                id => id.toString() !== bookId
            );
            await user.save();
            return res.status(200).json({ msg: "Book removed from favourites" });
        }
    } catch (err) {
        res.status(500).json({ msg: err });
    }
})


/**
 * @swagger
 * /api/book/deleteBook/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Book]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the book to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 */

router.delete("/deleteBook/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(400).json({ msg: "Book not found" });
        }

        const result = await Book.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json({ msg: "Book deleted successfully" });

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: err });
    }
})
module.exports = router