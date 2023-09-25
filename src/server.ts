// const express = require('express');
import express from 'express';
import cors from 'cors';
import type { IRecentEpisodes } from './types/aniwatch.d.ts';
import { fetchRecentEpisodes } from './utils/aniwatch_parser.js';


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

app.get('/recent-episodes', async (req, res) => {
    try {
        const page : number = parseInt(req.query?.page as string) || 1;
        const data : IRecentEpisodes | string = await fetchRecentEpisodes({page: page});
        return res.status(200).json(data);
    } catch (error) {
        res.status(400).send(`Some error occurred: ${error}`);
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});