import  express,{ Request, Response } from 'express';
// import * as  from "express";

import mongoose from 'mongoose';

import {router} from "./routes";

const app = express();
//TODO get from env
const PORT = process.env.PORT || 3000;
//TODO get from env
const MONGO_URI = "mongodb://localhost:27017/test"

// process.on('unhandledRejection', (reason, promise) => {
//     // const logger = new Logger('UnhandledRejection');
//     // logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
//     // console.log('reason', reason);
//     // logger.error(reason);
//     console.log("promise",promise)
// });
app.use(express.json());

app.use('/', router);

// Middleware

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
