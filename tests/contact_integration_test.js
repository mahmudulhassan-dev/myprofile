import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
    console.log('--- Starting Contact System Integration Tests ---');

    console.log('\n1. Testing Public Submission...');
    const form = new FormData();
    form.append('full_name', 'Integration Test User');
    form.append('email', 'test@integration.com');
    form.append('subject', 'Integration Test');
    form.append('message', 'This is a test message from the integration script.');
    form.append('project_type', 'Website');
    form.append('budget_range', '$100-300');

    try {
        const res = await fetch(`${BASE_URL}/contact/submit`, { method: 'POST', body: form });
        const data = await res.json();
        if (res.ok) console.log('✅ Submission Successful:', data);
        else console.error('❌ Submission Failed:', data);
    } catch (e) { console.error('❌ Submission Error:', e.message); }

    console.log('\n2. Testing Admin List (Auth Failure Expected if no token)...');
    try {
        const res = await fetch(`${BASE_URL}/admin/contacts`);
        if (res.status === 401) console.log('✅ Auth Protection Working (401 Unauthorized)');
        else console.error('❌ Auth Protection Failed:', res.status);
    } catch (e) { console.error('❌ List Error:', e.message); }

    console.log('\n--- Tests Completed ---');
};

runTests();
