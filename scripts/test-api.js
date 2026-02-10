const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function testApi() {
    try {
        // 1. Read .env.local
        const envPath = path.join(__dirname, '../.env.local');
        if (!fs.existsSync(envPath)) {
            console.error("Error: .env.local not found!");
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = {};
        const lines = envContent.split(/\r?\n/);
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;

            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (match) {
                let key = match[1].trim();
                let value = match[2].trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                envVars[key] = value;
            }
        });

        const apiKey = envVars['HOTELBEDS_API_KEY'];
        const apiSecret = envVars['HOTELBEDS_API_SECRET'];
        const endpoint = envVars['HOTELBEDS_ENDPOINT'] || 'https://api.test.hotelbeds.com';

        if (!apiKey || !apiSecret) {
            console.error("Error: HOTELBEDS_API_KEY or HOTELBEDS_API_SECRET missing in .env.local");
            return;
        }

        console.log(`Testing with endpoint: ${endpoint}`);
        console.log(`API Key present: ${!!apiKey}`);
        console.log(`API Secret present: ${!!apiSecret}`);

        // 2. Generate Signature
        const timestamp = Math.floor(Date.now() / 1000);
        const signatureRaw = `${apiKey}${apiSecret}${timestamp}`;
        const signature = crypto.createHash('sha256').update(signatureRaw).digest('hex');

        // 3. Make Request (Status or simple hotel query)
        console.log('Fetching status...');
        const url = `${endpoint}/hotel-content-api/1.0/status`;

        const response = await fetch(url, {
            headers: {
                'Api-key': apiKey,
                'X-Signature': signature,
                'Accept': 'application/json',
            }
        });

        console.log(`Response Status: ${response.status}`);

        if (!response.ok) {
            const text = await response.text();
            console.error("Error Body:", text);
        } else {
            const json = await response.json();
            console.log("Success! Status:", json);
        }

    } catch (err) {
        console.error("Script Execution Error:", err);
    }
}

testApi();
