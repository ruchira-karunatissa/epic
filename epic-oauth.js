const jwt = require('jsonwebtoken');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Configuration
const config = {
    oauth2TokenUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token',
    sandboxClientID: '...',
    privateKey: '...'  // Your private key string in PEM format
};

async function getOAuthToken() {
    try {
        // Construct JWT claims
        const now = Math.floor(Date.now() / 1000);
        const claims = {
            iss: config.sandboxClientID,
            sub: config.sandboxClientID,
            aud: config.oauth2TokenUrl,
            jti: uuidv4(),                // Unique identifier
            exp: now + 60                 // 1 minute from now (max 5 minutes)
        };
        console.log('Claims:', JSON.stringify(claims, null, 2));

        // Generate signed token using RS384 algorithm
        const signedToken = jwt.sign(claims, config.privateKey, { algorithm: 'RS384' });
        console.log('Signed token:', signedToken);

        // Prepare API call payload
        const payload = new URLSearchParams({
            grant_type: 'client_credentials',
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            client_assertion: signedToken
        });

        // Make the API call
        const response = await axios.post(config.oauth2TokenUrl, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response body:', response.data);

        return response.data;

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}

// Usage
async function main() {
    try {
        const token = await getOAuthToken();
        console.log('Successfully obtained token:', token);
    } catch (error) {
        console.error('Failed to obtain token:', error);
    }
}

main();