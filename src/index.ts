import  express,{ Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import {router} from "./routes";

const app = express();

const PORT = process.env.PORT;
const MONGO_URI = process.env.DATABASE_URL

process.on('unhandledRejection', (reason, promise) => {
    // const logger = new Logger('UnhandledRejection');
    // logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // console.log('reason', reason);
    // logger.error(reason);
    console.log("promise",promise)
});

app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/', router);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
