const jwt = require('jsonwebtoken');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Configuration
const config = {
    oauth2TokenUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token',
    sandboxClientID: '66f46d5f-7960-4d51-a24a-cfe41b7b17fb',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFm6WWT/UPv+0/
RJh03aWF9OoGkBxOIPUPoKQ0SRGspCqEfQp6693mbBTXh1CZRqoRXoSydYdDkbWo
u9FvWfkote/YCgWrxb9P8hoq+MWuYw4VxrvzZIJuvrcdQ/I+JH5hEjODlZZwR9v9
bbFGjkOTeP1Tx2N4VBNh/6EcGWeP42svEmL6PSVz9TOjRfV0MfD4WoO83av2GGtG
o7mDwIIYyOCc5TEibS1QZl3dRfvJmPBWIQzmfzgKy4Oxg2qiVuE4vMM07DmUkfjh
eadms0Xe6ZOFwwirrcn/BuDg06sQ7czOwivR6aQnk4VzdBF8u9Hld5HxSoOEOarO
TH5ZJrsnAgMBAAECggEAFa3K35qGWkPQ4taDL/BbEZRPZ7NABQrqPQcqIeRRmzzo
FIs6mZwDxvIyN9JMCNdu8/iIb/hN2R9aAcNtKXKs+jGPjlt3HiOpJpD7HEjDjdX8
fG4bk4sCIOUtEKRc0JgkrJXtxIX7haDp5RE3gsk7vP49MzJA2uQaZkTAUjqv7mHa
g54nBtNWkKdx+HW4h+FcAGl1Dp8clU4WKez0+MBRBON2raxt4fhsCGwDtLMjGamd
p7fpBRSESLQgNK3do9EN3fzWrynpPoWykH1TZU+Jalhhe2p0vloqEguI09SCYLXt
e/p15VAj0vqeU9X1eTeYa+TuGmHNijGHtIHlaqYJ5QKBgQD+SWQ9t/TjuIv/qO5a
Ue5LvepMwkQfEM84ADr2U3IJxxqwsokLcvwaHAgzkc/Kzs0trXprgI4Txp7pLrLg
bXEyvwmkOPazBJHV+bDJhMJXZjV/QUAdo828/MasLrGeevExZo6lEKbMaI/IJIpO
FFVpQL0h6UyWauPpMGNXLt25FQKBgQDG8H4YpLObNzrYgoicoC0ihwQd1qA/tIYN
QOXcfDOz3M4NUEcetcxhT789bmQCgmMagRivbWBX8Lkqr5qsuFE9fyDRBOwkDi8J
uzpULBMrnGTHfaq5xV9qZsAeT34r/ohLLbb4RLj10SVdPUo4ageOSoOqARNqxRbP
DoQ7IGf6SwKBgQC9dXcfWPk31d9RO89jMhonCrgQOsnAj6ik498Ker/Dszoantrm
0eQtm+csbR5xz8UlnFRS1nSFHX525FlYR5KIqbeISPzeArCZybDDZIvbzIZdawNX
Uh1PCtMHpL6oApfEI9Jx/8cXE2zVRQxbAmFky1xfcNCkXb2zl17crUl7xQKBgQDF
hZbNhQpHPGkS+1gEmwz1UTUHI0hsuCK5GgygBDmZhcyYb3KNzVel7vYkWmy2CRu4
/yCxXVnhNsPC3CQpBcCz3HuKzOZhTivp75mUZUaLcHank+BlHtED5g0uiyLtL4XH
jxYyHpm+h/AfSXFd3fiukNF1hCfxRMrGvtUPl7dlTQKBgD6AnBTAkn2jksCNHgqO
MGPaqzDCJ9nBbcRM+T2/x/UtKmds5xm7M6DUWOiNFFnkr7XhJmDUxd4TSogZrYUs
nem0DkCy4h1iOq2rel/iUQ+zq6WTVI/lxNfChRqIobgNE+ub1GlZ3YREyL83WwF/
0rh5rSUe6CGMsx6z82+2U42b
-----END PRIVATE KEY-----`  // Your private key string in PEM format
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