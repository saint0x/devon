const axios = require('axios');

async function serperSearch(query) {
  const data = JSON.stringify({ "q": query });

  const config = {
    method: 'post',
    url: 'https://google.serper.dev/search',
    headers: { 
      'X-API-KEY': process.env.SERPER_API_KEY, 
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error in Serper search:', error);
    return null;
  }
}

module.exports = serperSearch;