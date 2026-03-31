const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Book = require("../models/Book");
const Cart = require("../models/Cart");


/**
 * @swagger
 * /api/cart/addCartItem:
 *   post:
 *     summary: Add cart item
 *     tags: [Cart]
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

router.post("/addCartItem", async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ msg: "userId and bookId required" });
    }

    // Fetch book & user
    const book = await Book.findById(bookId);
    const user = await User.findById(userId);

    if (!book || !user) {
      return res.status(404).json({ msg: "User or Book not found" });
    }

    const existingItem = await Cart.findOne({ userId, bookId });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();

      return res.status(200).json({msg: "Quantity updated",cart: existingItem});
    }

    // Create new item
    const cart = new Cart({
      userId,
      bookId,
      bookName: book.bookName,
      amount: book.price,
      quantity: 1,
      payment: false // fix spelling also
    });

    await cart.save();

    return res.status(200).json({
      msg: "Item added to cart",
      cart
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router