const axios = require('axios');

exports.axiosInstance = axios.create({
    baseURL: 'https://aniwatch.to',
});