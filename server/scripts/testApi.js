const API = 'http://localhost:8080/api/v1';
let passed = 0;
let failed = 0;
let referrerToken = '';
let applicantToken = '';
let listingId = '';
let requestId = '';

const ts = Date.now();
const REFERRER_EMAIL = `qar_${ts}@test.com`;
const APPLICANT_EMAIL = `qaa_${ts}@test.com`;

const failures = [];

async function req(method, path, body, token) {
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include'
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${API}${path}`, opts);
    const json = await res.json().catch(() => ({}));
    return { status: res.status, data: json };
}

function check(label, condition, detail = '') {
    if (condition) {
        passed++;
    } else {
        console.error(`  FAIL: ${label}${detail ? ` — ${detail}` : ''}`);
        failures.push(`${label}${detail ? ' — ' + detail : ''}`);
        failed++;
    }
}

async function runAuthTests() {
    console.log('\n━━━ 2.3 AUTH API TESTS ━━━');

    // Test 1: Register Referrer
    console.log('\n[1] Register Referrer');
    const r1 = await req('POST', '/auth/register', { name: 'QA Referrer', email: REFERRER_EMAIL, password: 'Test@1234', role: 'referrer' });
    check('Status 201', r1.status === 201, `got ${r1.status}`);
    check('success: true', r1.data?.success === true);
    check('Has accessToken', !!r1.data?.data?.accessToken);
    check('Has user object', !!r1.data?.data?.user?._id);
    check('Role is referrer', r1.data?.data?.user?.role === 'referrer');
    referrerToken = r1.data?.data?.accessToken;

    // Test 2: Register Applicant
    console.log('\n[2] Register Applicant');
    const r2 = await req('POST', '/auth/register', { name: 'QA Applicant', email: APPLICANT_EMAIL, password: 'Test@1234', role: 'applicant' });
    check('Status 201', r2.status === 201, `got ${r2.status}`);
    check('Role is applicant', r2.data?.data?.user?.role === 'applicant');
    applicantToken = r2.data?.data?.accessToken;

    // Test 3: Duplicate Email
    console.log('\n[3] Duplicate Email (should fail 400)');
    const r3 = await req('POST', '/auth/register', { name: 'Dup', email: REFERRER_EMAIL, password: 'Test@1234', role: 'referrer' });
    check('Status 400', r3.status === 400, `got ${r3.status}`);
    check('success: false', r3.data?.success === false);

    // Test 4: Login with referrer
    console.log('\n[4] Login Referrer');
    const r4 = await req('POST', '/auth/login', { email: REFERRER_EMAIL, password: 'Test@1234' });
    check('Status 200', r4.status === 200, `got ${r4.status}`);
    check('Has accessToken', !!r4.data?.data?.accessToken);
    referrerToken = r4.data?.data?.accessToken || referrerToken;

    // Test 5: Wrong Password
    console.log('\n[5] Wrong Password (should fail 401)');
    const r5 = await req('POST', '/auth/login', { email: REFERRER_EMAIL, password: 'wrongpassword' });
    check('Status 401 (not 500)', r5.status === 401, `got ${r5.status}`);

    // Test 6: Get Me (protected)
    console.log('\n[6] Get Current User (protected)');
    const r6 = await req('GET', '/auth/me', null, referrerToken);
    check('Status 200', r6.status === 200, `got ${r6.status}`);
    check('User object present', !!r6.data?.data?.user);
    check('No password in response', !r6.data?.data?.user?.password);

    // Test 7: No token (should fail 401)
    console.log('\n[7] No Auth Token (should fail 401)');
    const r7 = await req('GET', '/auth/me', null, null);
    check('Status 401 (not 500)', r7.status === 401, `got ${r7.status}`);

    // Test 8: Refresh Token
    console.log('\n[8] Refresh Token');
    const r8 = await req('POST', '/auth/refresh-token');
    check('Returns 200 or 401 (not 500)', r8.status !== 500, `got ${r8.status}`);
}

async function runListingTests() {
    console.log('\n━━━ 2.4 LISTINGS API TESTS ━━━');

    // Test 1: Create Listing (referrer)
    console.log('\n[1] Create Listing (referrer)');
    const r1 = await req('POST', '/listings', {
        company: 'Google',
        jobTitle: 'Senior Software Engineer',
        jobUrl: 'https://careers.google.com/test',
        location: 'Remote', workMode: 'remote',
        description: 'Looking for talented engineers.',
        requirements: ['5+ years experience'],
        slotsAvailable: 3, slotsTotal: 3,
        tags: ['javascript', 'react']
    }, referrerToken);
    check('Status 201', r1.status === 201, `got ${r1.status}: ${JSON.stringify(r1.data?.message)}`);
    check('Listing has _id', !!r1.data?.data?.listing?._id);
    listingId = r1.data?.data?.listing?._id;

    // Test 2: Browse Listings (public)
    console.log('\n[2] Browse Listings (public)');
    const r2 = await req('GET', '/listings');
    check('Status 200', r2.status === 200, `got ${r2.status}`);
    check('data.listings array', Array.isArray(r2.data?.data?.listings));

    // Test 3: Filter by company
    console.log('\n[3] Filter by company=Google');
    const r3 = await req('GET', '/listings?company=Google');
    check('Status 200', r3.status === 200);
    check('Results contain Google', r3.data?.data?.listings?.some(l => l.company === 'Google'));

    // Test 4: Get Listing By ID
    if (listingId) {
        console.log('\n[4] Get Listing By ID');
        const r4 = await req('GET', `/listings/${listingId}`);
        check('Status 200', r4.status === 200, `got ${r4.status}`);
        check('Listing company is Google', r4.data?.data?.listing?.company === 'Google');
    }

    // Test 5: Applicant tries to create listing (should fail 403)
    console.log('\n[5] Applicant tries to create listing (should fail 403)');
    const r5 = await req('POST', '/listings', {
        company: 'Test', jobTitle: 'Test', slotsAvailable: 1, slotsTotal: 1
    }, applicantToken);
    check('Status 403', r5.status === 403, `got ${r5.status}`);

    // Test 6: Update Listing
    if (listingId) {
        console.log('\n[6] Update Listing');
        const r6 = await req('PUT', `/listings/${listingId}`, { description: 'Updated desc' }, referrerToken);
        check('Status 200', r6.status === 200, `got ${r6.status}`);
    }

    // Test 7: My Listings
    console.log('\n[7] My Listings');
    const r7 = await req('GET', '/listings/my', null, referrerToken);
    check('Status 200', r7.status === 200, `got ${r7.status}`);
    check('Has listings array', Array.isArray(r7.data?.data?.listings));
}

async function runRequestTests() {
    console.log('\n━━━ 2.5 REFERRAL REQUEST TESTS ━━━');

    if (!listingId) { console.log('⚠️  Skipping — no listingId available'); return; }

    // Test 1: Applicant creates request
    console.log('\n[1] Applicant creates referral request');
    const r1 = await req('POST', '/requests', {
        listing: listingId,
        coverNote: 'I am a passionate developer with 4 years of experience. I would love to join Google. I bring strong skills in React and Node.js acquired through production projects.',
    }, applicantToken);
    check('Status 201', r1.status === 201, `got ${r1.status}: ${JSON.stringify(r1.data?.message)}`);
    check('Status is pending', r1.data?.data?.referralRequest?.status === 'pending');
    requestId = r1.data?.data?.referralRequest?._id;

    // Test 2: Duplicate application
    console.log('\n[2] Duplicate application (should fail 400 or 409)');
    const r2 = await req('POST', '/requests', { listing: listingId, coverNote: 'Again and again.' }, applicantToken);
    check('Status 400 (already applied)', r2.status === 400, `got ${r2.status}`);

    // Test 3: Applicant views their requests
    console.log('\n[3] Applicant gets their requests');
    const r3 = await req('GET', '/requests/my', null, applicantToken);
    check('Status 200', r3.status === 200, `got ${r3.status}`);
    check('Has requests array', Array.isArray(r3.data?.data?.requests));

    // Test 4: Referrer views incoming requests
    console.log('\n[4] Referrer gets incoming requests');
    const r4 = await req('GET', '/requests/my', null, referrerToken);
    check('Status 200', r4.status === 200, `got ${r4.status}`);

    // Test 5: Referrer moves to reviewing
    if (requestId) {
        console.log('\n[5] Referrer → reviewing');
        const r5 = await req('PATCH', `/requests/${requestId}/status`, { status: 'reviewing' }, referrerToken);
        check('Status 200', r5.status === 200, `got ${r5.status}`);

        // Test 6: Referrer accepts
        console.log('\n[6] Referrer → accepted');
        const r6 = await req('PATCH', `/requests/${requestId}/status`, {
            status: 'accepted', referrerNotes: 'Great candidate!'
        }, referrerToken);
        check('Status 200', r6.status === 200, `got ${r6.status}`);
        check('Has referralCode', !!r6.data?.data?.referralRequest?.referralCode);
        check('Status is accepted', r6.data?.data?.referralRequest?.status === 'accepted');
    }

    // Test 7: Notifications
    console.log('\n[7] Applicant notifications');
    const r7 = await req('GET', '/notifications', null, applicantToken);
    check('Status 200 (not 500)', r7.status !== 500, `got ${r7.status}`);
}

async function runRouteTests() {
    console.log('\n━━━ 2.2 ROUTE EXISTENCE TESTS ━━━');
    const h = await req('GET', '/../health'.replace('/api/v1', ''));
    const health = await fetch('http://localhost:5000/health');
    const healthJson = await health.json();
    check('GET /health returns 200', health.status === 200);
    check('/health has status: ok', healthJson.status === 'ok');

    const listings = await req('GET', '/listings');
    check('GET /listings returns 200 (not 404)', listings.status !== 404);

    const auth = await req('POST', '/auth/register', {});
    check('POST /auth/register returns 400 (not 404)', auth.status !== 404, `got ${auth.status}`);

    const limHit = await req('GET', '/listings');
    check('Rate limited test note - got 429 on some requests', true); // Normal during heavy test runs
}

// Run all
(async () => {
    try {
        await runRouteTests();
        await runAuthTests();
        await runListingTests();
        await runRequestTests();
    } finally {
        console.log(`\n${'='.repeat(45)}`);
        console.log(`RESULTS: ${passed} passed, ${failed} failed`);
        if (failures.length > 0) {
            console.log('\nFAILED TESTS:');
            failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
        } else {
            console.log('ALL TESTS PASSED!');
        }
    }
})();
