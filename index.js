const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const bookRoutes = require("./src/routes/book");
const userRoutes = require("./src/routes/user")

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

const corsOptions = {
    origin: "*", // Allow all origins (for dev). In production, replace * with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Swagger setup
let swaggerSpec;
try {
    swaggerSpec = require("./src/swagger");
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} catch (err) {
    console.error("Swagger setup error:", err.message);
}

// Routes
app.use("/api/book", bookRoutes);
app.use("/api/user", userRoutes);

// MongoDB Connection and Server Start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // Exit if DB connection fails
    });