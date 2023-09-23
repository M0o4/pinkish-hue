const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const axios = require('./axiosInstance');
const axiosInstance = axios.axiosInstance;

app.use(cors());


app.get('/', (req, res) => {
    axiosInstance.get('/home').then((response) => {
        res.send(response.data);
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});