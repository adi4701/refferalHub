import dotenv from 'dotenv';
dotenv.config();

const required = [
    'PORT', 'MONGO_URI', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET',
    'JWT_EXPIRES_IN', 'CLIENT_URL', 'NODE_ENV'
];

// Optional but warn if missing (Cloudinary)
const optional = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];

let allGood = true;

console.log('=== ReferralHub Environment Validation ===\n');

required.forEach(key => {
    const val = process.env[key];
    if (!val || val.includes('<') || val.includes('>')) {
        console.error(`❌ MISSING or INVALID: ${key}`);
        allGood = false;
    } else {
        const display = (key.includes('SECRET') || key.includes('URI') || key.includes('KEY')) ? '[HIDDEN]' : val;
        console.log(`✅ ${key} = ${display}`);
    }
});

optional.forEach(key => {
    const val = process.env[key];
    if (!val || val.includes('<') || val.includes('>')) {
        console.warn(`⚠️  OPTIONAL MISSING: ${key} (required for image uploads)`);
    } else {
        console.log(`✅ ${key} = [HIDDEN]`);
    }
});

// MONGO_URI checks
if (process.env.MONGO_URI) {
    const uri = process.env.MONGO_URI;

    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
        console.error('❌ MONGO_URI: Must start with mongodb:// or mongodb+srv://');
        allGood = false;
    } else {
        console.log('✅ MONGO_URI: Valid scheme');
    }

    try {
        const afterProtocol = uri.split('://')[1];
        const username = afterProtocol.split(':')[0];
        const pathPart = uri.split('/').pop();
        const dbName = pathPart.split('?')[0];

        if (dbName === username) {
            console.error(`❌ MONGO_URI: Database name "${dbName}" is same as username! Change to /referralhub`);
            allGood = false;
        } else {
            console.log(`✅ MONGO_URI database name: ${dbName}`);
        }
    } catch (e) {
        console.warn('⚠️  Could not parse MONGO_URI components');
    }
}

// JWT checks
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error(`❌ JWT_SECRET is too short (${process.env.JWT_SECRET.length} chars, need 32+)`);
    allGood = false;
} else if (process.env.JWT_SECRET) {
    console.log(`✅ JWT_SECRET length: ${process.env.JWT_SECRET.length} chars`);
}

if (process.env.JWT_SECRET && process.env.REFRESH_TOKEN_SECRET &&
    process.env.JWT_SECRET === process.env.REFRESH_TOKEN_SECRET) {
    console.error('❌ JWT_SECRET and REFRESH_TOKEN_SECRET must be DIFFERENT strings');
    allGood = false;
} else if (process.env.JWT_SECRET && process.env.REFRESH_TOKEN_SECRET) {
    console.log('✅ JWT_SECRET and REFRESH_TOKEN_SECRET are different');
}

// NODE_ENV check
if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️  NODE_ENV is "production" — using production settings');
} else {
    console.log(`✅ NODE_ENV: ${process.env.NODE_ENV}`);
}

console.log(allGood
    ? '\n✅ All required environment variables are valid!'
    : '\n❌ Fix the above issues before starting the server.');

process.exit(allGood ? 0 : 1);
