import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
    console.log('🔄 Testing MongoDB connection...');
    const maskedUri = process.env.MONGO_URI?.replace(/:([^@]+)@/, ':****@');
    console.log('URI (masked):', maskedUri);

    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ MongoDB connected successfully');
        console.log('✅ Database:', mongoose.connection.db.databaseName);
        console.log('✅ Host:', mongoose.connection.host);

        const TestSchema = new mongoose.Schema({ ping: String });
        // Avoid model recompilation if running multiple times
        const TestModel = mongoose.models.Test || mongoose.model('Test', TestSchema);

        const doc = await TestModel.create({ ping: 'pong' });
        console.log('✅ Write test passed:', doc._id.toString());

        const found = await TestModel.findById(doc._id);
        console.log('✅ Read test passed:', found.ping);

        await TestModel.deleteOne({ _id: doc._id });
        console.log('✅ Delete test passed');

        await mongoose.disconnect();
        console.log('\n✅ ALL DATABASE TESTS PASSED');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ MongoDB connection failed:', err.message);
        if (err.message.includes('ECONNREFUSED')) console.error('→ Check your MONGO_URI. Is Atlas IP whitelist set to 0.0.0.0/0?');
        if (err.message.includes('Authentication failed')) console.error('→ Wrong username or password in MONGO_URI');
        if (err.message.includes('querySrv')) console.error('→ Invalid cluster hostname in MONGO_URI');
        process.exit(1);
    }
}

testConnection();
