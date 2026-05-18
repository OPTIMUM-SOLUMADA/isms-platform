#!/usr/bin/env node

/**
 * Authentication Endpoint Testing Script
 * Tests all critical API endpoints for authentication issues
 * Usage: node test-auth-endpoints.js <BASE_URL>
 * Example: node test-auth-endpoints.js https://your-api.onrender.com
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.argv[2] || 'http://localhost:8000';
const TEST_USER = {
    email: process.env.TEST_USER_EMAIL || 'admin@example.com',
    password: process.env.TEST_USER_PASSWORD || 'Admin@123',
};

let accessToken = '';
let refreshToken = '';
const cookies = [];

console.log('\n🔐 Authentication Endpoint Testing');
console.log('=====================================');
console.log(`Base URL: ${BASE_URL}`);
console.log(`Test User: ${TEST_USER.email}\n`);

/**
 * Make HTTP request
 */
function makeRequest(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const isHttps = url.protocol === 'https:';
        const client = isHttps ? https : http;

        const bodyData = data ? JSON.stringify(data) : null;

        const options = {
            method,
            hostname: url.hostname,
            port: url.port || (isHttps ? 443 : 80),
            path: url.pathname + url.search,
            headers: {
                'Content-Type': 'application/json',
                ...(bodyData && { 'Content-Length': Buffer.byteLength(bodyData) }),
                ...headers,
            },
        };

        console.log(`   → ${method} ${url.hostname}${url.pathname}`);

        const req = client.request(options, (res) => {
            let body = '';
            
            // Capture cookies
            const setCookie = res.headers['set-cookie'];
            if (setCookie) {
                setCookie.forEach(cookie => {
                    const cookieName = cookie.split('=')[0];
                    const cookieValue = cookie.split(';')[0].split('=')[1];
                    cookies.push({ name: cookieName, value: cookieValue });
                    
                    if (cookieName === 'refreshToken') {
                        refreshToken = cookieValue;
                    }
                });
            }

            // Capture Authorization header
            const authHeader = res.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                accessToken = authHeader.split(' ')[1];
            }

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                console.log(`   ← ${res.statusCode} ${res.statusMessage || ''}`);
                
                try {
                    const jsonBody = body ? JSON.parse(body) : {};
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: jsonBody,
                    });
                } catch (e) {
                    // If JSON parsing fails, return raw body
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: { rawBody: body, parseError: e.message },
                    });
                }
            });
        });

        req.on('error', (error) => {
            console.log(`   ✗ Request error: ${error.message}`);
            reject(error);
        });

        if (bodyData) {
            req.write(bodyData);
        }
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

/**
 * Test results formatter
 */
function logTestResult(name, passed, details = {}) {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${name}`);
    if (Object.keys(details).length > 0) {
        console.log(`   ${JSON.stringify(details, null, 2).replace(/\n/g, '\n   ')}`);
    }
    console.log('');
}

/**
 * Test 1: Login
 */
async function testLogin() {
    console.log('🔹 Test 1: POST /auth/login');
    console.log(`   Testing with: ${TEST_USER.email}`);
    
    try {
        const response = await makeRequest('POST', '/auth/login', TEST_USER);
        
        const passed = response.status === 200 && 
                       accessToken !== '' && 
                       refreshToken !== '';
        
        logTestResult('Login', passed, {
            status: response.status,
            hasAccessToken: accessToken !== '',
            accessTokenLength: accessToken.length,
            hasRefreshToken: refreshToken !== '',
            refreshTokenLength: refreshToken.length,
            error: response.body?.error,
            code: response.body?.code,
            body: response.status !== 200 ? response.body : { success: true },
        });

        return passed;
    } catch (error) {
        logTestResult('Login', false, { 
            error: error.message,
            stack: error.stack?.split('\n')[0],
        });
        return false;
    }
}

/**
 * Test 2: Refresh Token
 */
async function testRefresh() {
    console.log('🔹 Test 2: POST /auth/refresh');
    try {
        const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
        const response = await makeRequest('POST', '/auth/refresh', null, {
            Cookie: cookieHeader,
        });

        const oldAccessToken = accessToken;
        const passed = response.status === 200 && 
                       accessToken !== oldAccessToken &&
                       accessToken !== '';

        logTestResult('Refresh Token', passed, {
            status: response.status,
            newAccessToken: accessToken !== oldAccessToken,
            accessTokenLength: accessToken.length,
            body: response.body,
        });

        return passed;
    } catch (error) {
        logTestResult('Refresh Token', false, { error: error.message });
        return false;
    }
}

/**
 * Test protected endpoints
 */
async function testProtectedEndpoint(name, method, path) {
    console.log(`🔹 Test: ${method} ${path}`);
    try {
        const response = await makeRequest(method, path, null, {
            Authorization: `Bearer ${accessToken}`,
        });

        const passed = response.status === 200;

        logTestResult(name, passed, {
            status: response.status,
            hasData: !!response.body,
            error: response.body?.error || response.body?.code,
        });

        return passed;
    } catch (error) {
        logTestResult(name, false, { error: error.message });
        return false;
    }
}

/**
 * Test expired token
 */
async function testExpiredToken() {
    console.log('🔹 Test: Expired Token Handling');
    try {
        // Use an obviously expired token
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTYyMzkwMjJ9.invalid';
        
        const response = await makeRequest('GET', '/api/documents', null, {
            Authorization: `Bearer ${expiredToken}`,
        });

        const passed = response.status === 401 || response.status === 403;

        logTestResult('Expired Token Rejection', passed, {
            status: response.status,
            error: response.body?.error,
            code: response.body?.code,
        });

        return passed;
    } catch (error) {
        logTestResult('Expired Token Rejection', false, { error: error.message });
        return false;
    }
}

/**
 * Main test runner
 */
async function runTests() {
    const results = {
        passed: 0,
        failed: 0,
        tests: [],
    };

    // Test 1: Login
    const loginPassed = await testLogin();
    results.tests.push({ name: 'Login', passed: loginPassed });
    if (loginPassed) results.passed++; else results.failed++;

    if (!loginPassed) {
        console.log('❌ Login failed. Cannot proceed with other tests.\n');
        return results;
    }

    // Test 2: Refresh
    const refreshPassed = await testRefresh();
    results.tests.push({ name: 'Refresh', passed: refreshPassed });
    if (refreshPassed) results.passed++; else results.failed++;

    // Test 3-12: Protected endpoints
    const endpoints = [
        { name: 'Document Statistics', method: 'GET', path: '/api/documents/statistics' },
        { name: 'Departments', method: 'GET', path: '/api/departments' },
        { name: 'Document Types', method: 'GET', path: '/api/document-types' },
        { name: 'Documents', method: 'GET', path: '/api/documents' },
        { name: 'Notifications', method: 'GET', path: '/api/notifications' },
        { name: 'ISO Clauses', method: 'GET', path: '/api/iso-clauses' },
    ];

    for (const endpoint of endpoints) {
        const passed = await testProtectedEndpoint(endpoint.name, endpoint.method, endpoint.path);
        results.tests.push({ name: endpoint.name, passed });
        if (passed) results.passed++; else results.failed++;
    }

    // Test: Expired token
    const expiredPassed = await testExpiredToken();
    results.tests.push({ name: 'Expired Token Handling', passed: expiredPassed });
    if (expiredPassed) results.passed++; else results.failed++;

    // Summary
    console.log('\n📊 Test Summary');
    console.log('=====================================');
    console.log(`Total Tests: ${results.tests.length}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`Success Rate: ${Math.round((results.passed / results.tests.length) * 100)}%\n`);

    // Diagnosis
    console.log('🔍 Diagnosis');
    console.log('=====================================');
    
    if (results.failed === 0) {
        console.log('✅ All tests passed! Authentication is working correctly.\n');
    } else {
        console.log('⚠️  Some tests failed. Recommended actions:\n');
        
        if (!loginPassed) {
            console.log('1. Verify user credentials');
            console.log('2. Check DATABASE_URL is correct');
            console.log('3. Ensure user exists and is active\n');
        }
        
        if (!refreshPassed) {
            console.log('1. Check cookie configuration (sameSite, secure, httpOnly)');
            console.log('2. Verify CORS_ORIGIN matches client domain');
            console.log('3. Ensure JWT_REFRESH_SECRET is set correctly');
            console.log('4. Check if cookies are being sent (see network tab)\n');
        }
        
        const failedEndpoints = results.tests.filter(t => !t.passed && !['Login', 'Refresh'].includes(t.name));
        if (failedEndpoints.length > 0) {
            console.log('1. Verify JWT_ACCESS_SECRET is correctly configured');
            console.log('2. Check if access token is being sent in Authorization header');
            console.log('3. Ensure token is not expired (check JWT_ACCESS_EXPIRES_IN)');
            console.log('4. Review auth middleware logs for detailed errors\n');
        }
    }

    return results;
}

// Run tests
runTests().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
});
