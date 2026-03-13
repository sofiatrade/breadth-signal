exports.handler = async function(event) {
  const url = event.queryStringParameters?.url;
  if (!url) return { statusCode: 400, body: 'Missing url parameter' };

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed: ${response.status}`);
    const text = await response.text();
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
