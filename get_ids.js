const https = require('https');
https.get('https://unpkg.com/@svg-maps/india/india.svg', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const ids = [...data.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
        const names = [...data.matchAll(/name="([^"]+)"/g)].map(m => m[1]);
        console.log(JSON.stringify(ids.map((id, i) => ({id, name: names[i]}))));
    });
});
