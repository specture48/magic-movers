import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {scopePerRequest} from "awilix-express";

dotenv.config();

import {router} from "./routes";
import container from "./container";
import swaggerOptions from "./config/swagger.config";

const app = express();

//TODO check all routes if need transaction

const PORT = process.env.PORT;
const MONGO_URI = process.env.DATABASE_URL

process.on('unhandledRejection', (reason, promise) => {
    console.log("promise", promise)
});


const swaggerSpec = swaggerJsdoc(swaggerOptions);
// Middleware for Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(scopePerRequest(container));

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api', router);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});