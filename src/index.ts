import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {scopePerRequest} from "awilix-express";

dotenv.config();

import {router} from "./routes";
import container from "./container";

const app = express();

//TODO create tsconfig paths
//TODO check all routes if need transaction

const PORT = process.env.PORT;
const MONGO_URI = process.env.DATABASE_URL

process.on('unhandledRejection', (reason, promise) => {
    // const logger = new Logger('UnhandledRejection');
    // logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // console.log('reason', reason);
    // logger.error(reason);
    console.log("promise", promise)
});

//TODO clean the code here and move it to seperated file
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Magic Movers API',
            version: '1.0.0',
            description: 'API for managing Magic Movers and their activities',
        },
        servers: [
            {
                url: '/api', // Prefix for all APIs
                description: 'API base path',
            },
        ],
        components: {
            schemas: {
                MagicItem: {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "The unique identifier of the Magic Item.",
                            "example": "64b5f5e2e1a5c9f9f1e9b8a9"
                        },
                        "name": {
                            "type": "string",
                            "description": "The name of the Magic Item.",
                            "example": "Magic Sword"
                        },
                        "weight": {
                            "type": "number",
                            "description": "The weight of the Magic Item.",
                            "example": 10
                        },
                        "createdAt": {
                            "type": "string",
                            "format": "date-time",
                            "description": "The timestamp when the Magic Item was created.",
                            "example": "2024-11-14T10:00:00Z"
                        },
                        "updatedAt": {
                            "type": "string",
                            "format": "date-time",
                            "description": "The timestamp when the Magic Item was last updated.",
                            "example": "2024-11-14T10:00:00Z"
                        }
                    },
                    "required": ["id", "name", "weight", "createdAt", "updatedAt"]
                },
                Mover: {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "format": "uuid",
                            "description": "Unique identifier for the Magic Mover."
                        },
                        "name": {
                            "type": "string",
                            "description": "The name of the Magic Mover."
                        },
                        "weightLimit": {
                            "type": "integer",
                            "description": "The weight limit that the mover can carry."
                        },
                        "questState": {
                            "type": "string",
                            "enum": ["resting", "loading", "on-mission"],
                            "description": "Current state of the Magic Mover."
                        },
                        "missionsCompleted": {
                            "type": "integer",
                            "description": "The total number of missions the Magic Mover has completed."
                        },
                        "createdAt": {
                            "type": "string",
                            "format": "date-time",
                            "description": "Timestamp when the Magic Mover was created."
                        },
                        "updatedAt": {
                            "type": "string",
                            "format": "date-time",
                            "description": "Timestamp when the Magic Mover was last updated."
                        }
                    },
                    "required": ["name", "weightLimit", "questState", "missionsCompleted"],
                    "example": {
                        "id": "64b5f5e2e1a5c9f9f1e9b8a7",
                        "name": "Mover1",
                        "weightLimit": 500,
                        "questState": "resting",
                        "missionsCompleted": 10,
                        "createdAt": "2024-11-14T10:00:00Z",
                        "updatedAt": "2024-11-14T10:05:00Z"
                    }
                },
                ActivityLog: {
                    type: "object",
                    properties: {
                        id: {
                            "type": "string",
                            "format": "uuid",
                            "description": "Unique identifier for the activity log entry."
                        },
                        mover: {
                            "type": "string",
                            "format": "uuid",
                            "description": "ID of the Magic Mover associated with the log entry."
                        },
                        action: {
                            "type": "string",
                            "enum": ["loading", "on-mission", "resting"],
                            "description": "The action performed by the Magic Mover."
                        },
                        items: {
                            "type": "array",
                            "items": {
                                "type": "string",
                                "format": "uuid",
                                "description": "ID of a Magic Item involved in the action."
                            },
                            "description": "List of items involved in the action (if any)."
                        },
                        createdAt: {
                            "type": "string",
                            "format": "date-time",
                            "description": "Timestamp when the activity log entry was created."
                        },
                        updatedAt: {
                            "type": "string",
                            "format": "date-time",
                            "description": "Timestamp when the activity log entry was last updated."
                        }
                    },
                    required: ["mover", "action"],
                    example: {
                        "id": "64b5f5e2e1a5c9f9f1e9b8a7",
                        "mover": "64b5f5e2e1a5c9f9f1e9b8a6",
                        "action": "loading",
                        "items": [
                            "64b5f5e2e1a5c9f9f1e9b8b1",
                            "64b5f5e2e1a5c9f9f1e9b8b2"
                        ],
                        "createdAt": "2024-11-14T10:00:00Z",
                        "updatedAt": "2024-11-14T10:05:00Z"
                    }
                }
            },
        },
    },
    apis: ['./src/routes/**/*.ts'], // Include all .ts files in the routes directory and subdirectories
};

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