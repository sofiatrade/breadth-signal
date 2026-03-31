const https = require('https');
const http  = require('http');
 
exports.handler = async function(event) {
  const url = event.queryStringParameters?.url;
  if (!url) return { statusCode: 400, body: 'Missing url parameter' };
 
  try {
    const result = await new Promise((resolve, reject) => {
      const lib = url.startsWith('https') ? https : http;
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'identity',
          'Connection': 'keep-alive',
          'Referer': 'https://marketcharts.com/',
        }
      };
      lib.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      }).on('error', (e) => reject(e));
    });
 
    if(result.status !== 200) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: `MarketCharts returned status ${result.status}. Headers: ${JSON.stringify(result.headers)}. Body: ${result.body.substring(0, 500)}`
      };
    }
 
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
      body: result.body
    };
  } catch (e) {
    return { 
      statusCode: 500, 
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: `Error: ${e.message} | Stack: ${e.stack}` 
    };
  }
};
 
