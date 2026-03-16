import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
        }

        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);

        // Ensure indexes are built
        await mongoose.syncIndexes();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
