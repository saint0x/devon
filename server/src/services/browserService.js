const axios = require('axios');

exports.fetchPage = async (url, method = 'GET', headers = {}, data = null) => {
  try {
    const response = await axios({
      url,
      method,
      headers,
      data,
      responseType: 'arraybuffer'
    });

    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data.toString('base64'),
      contentType: response.headers['content-type']
    };
  } catch (error) {
    if (error.response) {
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data.toString('base64'),
        contentType: error.response.headers['content-type']
      };
    }
    throw error;
  }
};