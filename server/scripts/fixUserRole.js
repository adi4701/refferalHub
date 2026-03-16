import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });

const userSchema = new mongoose.Schema({ name: String, email: String, role: String, password: String }, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Get the email from command line or fix all applicants who have a referrer-sounding name
const targetEmail = process.argv[2];

if (targetEmail) {
    const result = await User.findOneAndUpdate(
        { email: targetEmail },
        { $set: { role: 'referrer' } },
        { new: true }
    ).lean();
    console.log(`Updated: ${result?.email} → role: ${result?.role}`);
} else {
    // List ALL users so user can pick
    const all = await User.find({}, 'name email role').sort('-_id').lean();
    console.log('\nAll users:');
    all.forEach((u, i) => console.log(` ${i + 1}. [${(u.role || '?').padEnd(10)}] ${u.email} — ${u.name}`));
    console.log('\nTo fix a user role, run:');
    console.log('  node scripts/fixUserRole.js <email>');
}

await mongoose.disconnect();
