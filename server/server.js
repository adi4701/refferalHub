import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './src/app.js';

// Load Env variables - Do this first!
dotenv.config();

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// Connect to Database
connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Handle Unhandled Rejections
    process.on('unhandledRejection', (err) => {
        console.log('UNHANDLED REJECTION! 💥 Shutting down...');
        console.log(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });
});
