const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @swagger
 * /api/payment/create-qr:
 *   post:
 *     summary: Pay amount
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - userId
 *               - bookId
 *             properties:
 *               amount:
 *                 type: number
 *               userId:
 *                 type: string
 *               bookId:
 *                 type: string
 *     responses:
 *       200:
 *         description: payment initiated successfully
 */

// Create QR Code
router.post("/create-qr", async (req, res) => {
    console.log("-----------------------------")
  try {
    const { amount, userId, bookId } = req.body;

    // ✅ Validation
    if (!amount || !userId || !bookId) {
      return res.status(400).json({
        success: false,
        message: "amount, userId and bookId are required",
      });
    }

    const qr = await razorpay.qrCode.create({
      type: "upi_qr",
      name: "Book Store Payment",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: amount * 100,
      description: "Book purchase",
      notes: {
        userId,
        bookId,
      },
    });

    return res.status(200).json({
      success: true,
      qr,
    });

  } catch (err) {
    console.error("QR Error:", err);

    return res.status(500).json({
      success: false,
      message: "QR creation failed",
      error: err.message,
    });
  }
});

module.exports = router;