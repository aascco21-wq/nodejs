const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const runTest = (name, method, endpoint, body = null, token = null) => {
    return new Promise((resolve) => {
        console.log(`\n--- Testing ${name} ---`);
        const options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: `/api${endpoint}`,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        if (body) {
            options.headers['Content-Length'] = JSON.stringify(body).length;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`Status: ${res.statusCode}`);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ Success');
                    // console.log('Response:', data.substring(0, 100) + '...');
                } else {
                    console.log('❌ Failed');
                    console.log('Response:', data);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Request Error: ${e.message}`);
            resolve();
        });

        if (body) req.write(JSON.stringify(body));
        req.end();
    });
};

const runAllTests = async () => {
    // 1. Health Check (Server Root - manual check via log implies it runs)

    // 2. Auth - Login
    await runTest('Auth: Login', 'POST', '/auth/login', {
        email: 'admin@aascco.com',
        password: 'admin123'
    });

    // 3. Stats
    await runTest('Stats: Get Dashboard Data', 'GET', '/stats');

    // 4. Services - Get All
    await runTest('Services: Get All', 'GET', '/services');

    // 5. Projects - Get All
    await runTest('Projects: Get All', 'GET', '/projects');

    // 6. Content - Get Site Content
    await runTest('Content: Get Site Info', 'GET', '/content');

    console.log('\n--- Test Suite Completed ---');
};

runAllTests();
