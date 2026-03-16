import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { createRequire } from 'module';

const uri = process.env.MONGO_URI;
await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

// Inline schema to avoid import issues
const userSchema = new mongoose.Schema({ name: String, email: String, role: String }, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const users = await User.find({}, 'name email role').sort('-_id').limit(10).lean();
console.log('\nRecent users in DB:');
users.forEach(u => console.log(` [${(u.role || '?').padEnd(10)}] ${u.email} — ${u.name}`));

await mongoose.disconnect();
