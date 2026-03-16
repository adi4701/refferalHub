import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });

const schema = new mongoose.Schema({ name: String, email: String, password: String, role: String }, { strict: false });
const User = mongoose.models.User || mongoose.model('User', schema);

const newPassword = process.argv[2] || 'ReferralHub@123';
const targetEmail = process.argv[3] || 'adityarishi322@gmail.com';

const hashed = await bcrypt.hash(newPassword, 12);
const result = await User.findOneAndUpdate(
    { email: targetEmail },
    { $set: { password: hashed, role: 'referrer' } },
    { new: true }
).lean();

if (result) {
    console.log(`✅ Password reset for: ${result.email}`);
    console.log(`   New password: ${newPassword}`);
    console.log(`   Role: ${result.role}`);
} else {
    console.log(`❌ User not found: ${targetEmail}`);
}

await mongoose.disconnect();
