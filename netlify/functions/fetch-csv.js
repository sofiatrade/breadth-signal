const https = require('https');
const http  = require('http');
 
exports.handler = async function(event) {
  const url = event.queryStringParameters?.url;
  if (!url) return { statusCode: 400, body: 'Missing url parameter' };
 
  try {
    const text = await new Promise((resolve, reject) => {
      const lib = url.startsWith('https') ? https : http;
      lib.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
 
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
      body: text
    };
  } catch (e) {
    return { statusCode: 500, body: `Error: ${e.message}` };
  }
};
 
