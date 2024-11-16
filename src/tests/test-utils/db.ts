import {MongoMemoryReplSet, MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";

// let mongoServer: MongoMemoryServer;
let replSet: MongoMemoryReplSet;

/**
 * Sets up an in-memory MongoDB instance and connects Mongoose.
 */
export const connectToDatabase = async (): Promise<void> => {
    // Start an in-memory replica set
    replSet = await MongoMemoryReplSet.create({
        replSet: {count: 1}, // 1 member in the replica set
    });

    const uri = replSet.getUri();
    await mongoose.connect(uri)
        .then((result) => {
            // console.log(result.connection.readyState)
            // console.log(result.connection.host)
        }).catch((err) => {
            console.log(err)
        });
    ;

    // mongoServer = await MongoMemoryServer.create();
    // const uri = mongoServer.getUri();
    // console.log("dsadas",uri)
    // await mongoose.connect(uri);
    // console.log("connected to database");
};

// /**
//  * Clears all data in all collections.
//  */
// export const clearDatabase = async (): Promise<void> => {
//     const collections = mongoose.connection.collections;
//     for (const key in collections) {
//         await collections[key].deleteMany({});
//     }
// };
/**
 * Clears all data in all collections.
 */
export const clearDatabase = async (): Promise<void> => {
    await new Promise<void>((resolve, reject) => {
        if (mongoose.connection.readyState !== 1) {
            return reject(new Error("Database not ready"));
        }

        const collections = mongoose.connection.collections;
        let clearPromises: Array<Promise<any>> = [];

        for (const key in collections) {
            clearPromises.push(collections[key].deleteMany({}));
        }

        Promise.all(clearPromises)
            .then(() => resolve())
            .catch(err => reject(err));
    });
};

/**
 * Closes the database connection and stops MongoMemoryServer.
 */
export const disconnectFromDatabase = async (): Promise<void> => {
    // await mongoose.connection.dropDatabase();
    // await mongoose.connection.close();
    // await mongoServer.stop();
    await mongoose.disconnect();
    if (replSet) {
        await replSet.stop();
    }
};
