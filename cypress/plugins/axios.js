const axios = require('axios');

async function apiRequest({ method, url, data, headers }) {
  const baseUrl = process.env.MOCK_API;
  const fullUrl = `${baseUrl}${url}`;
  
  try {
    const response = await axios({
      method,
      url: fullUrl,
      data,
      headers
    });
    return response.data;
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }
}

module.exports = (on) => {
  on('task', {
    apiRequest
  });
};