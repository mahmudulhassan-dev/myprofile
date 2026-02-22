import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

const runAuthTests = async () => {
    console.log('--- Starting Phase 4 Auth System Tests ---');

    let accessToken = '';
    let refreshToken = '';

    console.log('\n1. Testing Login (Should return both tokens)...');
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@antigravity.com', password: 'password' }) // Assuming seed user
        });
        const data = await res.json();
        if (res.ok) {
            accessToken = data.data.token;
            refreshToken = data.data.refreshToken;
            console.log('✅ Login Successful');
            console.log('Access Token Length:', accessToken.length);
            console.log('Refresh Token Length:', refreshToken.length);
        } else {
            console.error('❌ Login Failed:', data.message);
        }
    } catch (e) { console.error('❌ Login Error:', e.message); }

    if (refreshToken) {
        console.log('\n2. Testing Token Refresh...');
        try {
            const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });
            const data = await res.json();
            if (res.ok) {
                console.log('✅ Token Refresh Successful');
                console.log('New Access Token Length:', data.token.length);
            } else {
                console.error('❌ Token Refresh Failed:', data.message);
            }
        } catch (e) { console.error('❌ Refresh Error:', e.message); }
    }

    console.log('\n3. Testing Forgot Password...');
    try {
        const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@antigravity.com' })
        });
        const data = await res.json();
        if (res.ok) console.log('✅ Forgot Password Triggered');
        else console.error('❌ Forgot Password Failed:', data.message);
    } catch (e) { console.error('❌ Forgot Password Error:', e.message); }

    console.log('\n--- Auth Tests Completed ---');
};

runAuthTests();
