#!/usr/bin/env node

/**
 * Quick Authentication Test Script
 * Simple test to diagnose login issues
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.argv[2] || 'http://localhost:8000';
const EMAIL = process.argv[3] || 'admin@example.com';
const PASSWORD = process.argv[4] || 'Admin@123';

console.log('\n🔐 Quick Authentication Test');
console.log('==============================');
console.log(`Base URL: ${BASE_URL}`);
console.log(`Email: ${EMAIL}`);
console.log(`Password: ${'*'.repeat(PASSWORD.length)}\n`);

async function testLogin() {
    return new Promise((resolve, reject) => {
        const url = new URL('/auth/login', BASE_URL);
        const isHttps = url.protocol === 'https:';
        const client = isHttps ? https : http;

        const postData = JSON.stringify({
            email: EMAIL,
            password: PASSWORD,
            rememberMe: false,
        });

        const options = {
            method: 'POST',
            hostname: url.hostname,
            port: url.port || (isHttps ? 443 : 80),
            path: '/auth/login',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        console.log('📤 Sending login request...');
        console.log(`   URL: ${url.href}`);
        console.log(`   Body: ${postData}\n`);

        const req = client.request(options, (res) => {
            let body = '';

            console.log(`📥 Response received:`);
            console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
            console.log(`   Headers:`, JSON.stringify(res.headers, null, 2));

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                console.log(`\n📄 Response body:`);
                try {
                    const jsonBody = JSON.parse(body);
                    console.log(JSON.stringify(jsonBody, null, 2));
                    
                    // Check for success
                    if (res.statusCode === 200) {
                        console.log('\n✅ Login successful!');
                        
                        // Check tokens
                        const hasAuthHeader = res.headers['authorization'];
                        const hasCookie = res.headers['set-cookie'];
                        
                        console.log('\n🔑 Token information:');
                        console.log(`   Authorization header: ${hasAuthHeader ? '✅ Present' : '❌ Missing'}`);
                        if (hasAuthHeader) {
                            console.log(`   Token length: ${hasAuthHeader.split(' ')[1]?.length || 0} chars`);
                        }
                        
                        console.log(`   Refresh cookie: ${hasCookie ? '✅ Present' : '❌ Missing'}`);
                        if (hasCookie) {
                            console.log(`   Cookies: ${hasCookie.join(', ')}`);
                        }
                        
                        resolve(true);
                    } else {
                        console.log(`\n❌ Login failed with status ${res.statusCode}`);
                        console.log('\n💡 Diagnosis:');
                        
                        if (jsonBody.code === 'ERR_INVALID_CREDENTIALS') {
                            console.log('   • Invalid email or password');
                            console.log('   • Check that the user exists in the database');
                            console.log('   • Verify the password is correct');
                        } else if (jsonBody.code === 'ERR_USER_INACTIVE') {
                            console.log('   • User account is inactive');
                            console.log('   • Contact admin to activate the account');
                        } else {
                            console.log(`   • Error code: ${jsonBody.code}`);
                            console.log(`   • Error message: ${jsonBody.error}`);
                        }
                        
                        resolve(false);
                    }
                } catch (e) {
                    console.log('Raw body (JSON parse failed):', body);
                    console.log('Parse error:', e.message);
                    resolve(false);
                }
            });
        });

        req.on('error', (error) => {
            console.error('\n❌ Request error:', error.message);
            console.error('\n💡 Diagnosis:');
            
            if (error.code === 'ECONNREFUSED') {
                console.error('   • Server is not running');
                console.error('   • Check if the server is started on', BASE_URL);
            } else if (error.code === 'ENOTFOUND') {
                console.error('   • Invalid hostname');
                console.error('   • Check the BASE_URL:', BASE_URL);
            } else {
                console.error(`   • Error code: ${error.code}`);
                console.error(`   • Error message: ${error.message}`);
            }
            
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Run test
testLogin()
    .then((success) => {
        if (success) {
            console.log('\n✨ Test completed successfully!');
            process.exit(0);
        } else {
            console.log('\n❌ Test failed!');
            console.log('\n📚 Next steps:');
            console.log('   1. Verify the server is running');
            console.log('   2. Check the user credentials');
            console.log('   3. Review server logs for more details');
            console.log('   4. Check database connectivity');
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error('\n💥 Test crashed:', error);
        process.exit(1);
    });
