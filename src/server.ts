// const express = require('express');
import express from 'express';
import axios from 'axios';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: true,
    credentials: true,
    port: PORT,
};

app.use(cors(corsOptions));



app.get('/', (req, res) => {
    res.send('Welcome to pinkish-hue API! 🎉');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});