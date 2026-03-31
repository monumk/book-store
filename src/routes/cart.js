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
      author: book.author,
      image: book.image,
      amount: book.price,
      quantity: 1,
      payment: false
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

/**
 * @swagger
 * /api/cart/getCartItems/{id}:
 *   get:
 *     summary: Get cart items by user ID
 *     tags: [Cart]
 *     description: Fetch all cart items for a specific user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */

router.get("/getCartItems/:id", async (req, res)=>{
  try{
    const userId = req.params.id;
    console.log(userId)
    const list = await Cart.find({userId: userId});
    return res.status(200).json({
      msg: "Item fetched successfully",
      list: list
    });
  }catch(err){
    return res.status(500).json({ msg: "Server error" });
  }
})

module.exports = router