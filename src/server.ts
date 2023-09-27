const express = require("express");
const cors = require("cors");
import type { IAnimeInfo, IEpisodeSources, IError, IRecentEpisodes, ISearchData } from "./types/aniwatch.d.ts";
import { fetchRecentEpisodes, fetchPopular, fetchSearch, fetchInfo, fetchEpisodeSource } from "./utils/aniwatch_parser";

const app = express();
const PORT = process.env.PORT || 3000;

var served = 0;
var concurrent = 0;

const corsOptions = {
  origin: true,
  credentials: true,
  port: PORT,
};

app.use(cors(corsOptions));

app.get("/", (req: any, res: any) => {
  ++concurrent;
  const homeinfo = {
    message: "Welcome to the Pinkish-Hue API! 🎉",
    "endpoints": ["/recent-episodes", "/popular",
    "/search?keyword=yourkeyword",
    "/info/:id","/watch/:id"],
  };
  res.status(200).send(homeinfo);
  --concurrent;
  ++served;
});

app.get("/recent-episodes", async (req: any, res: any) => {
  ++concurrent;
  try {
    const page: number = parseInt(req.query?.page as string) || 1;
    const data: IRecentEpisodes | IError = await fetchRecentEpisodes({
      page: page,
    });
    if ("error" in data) {
      --concurrent;
      return res.status(400).send({ error: `Some error occurred: ${data.error}` });
    }
    --concurrent;
    ++served;
    return res.status(200).json(data);
  } catch (error) {
    --concurrent;
    res.status(400).send(`Some error occurred: ${error}`);
  }
});

app.get("/popular", async (req: any, res: any) : Promise<IRecentEpisodes | IError> => {
  ++concurrent;
  try {
    const page: number = parseInt(req.query?.page as string) || 1;
    const data: IRecentEpisodes | IError = await fetchPopular({ page: page });
    if ("error" in data) {
      --concurrent;
      return res.status(400).send({ error: `Some error occurred: ${data.error}` });
    }
    --concurrent;
    ++served;
    return res.status(200).json(data);
  } catch (error) {
    --concurrent;
    return res.status(400).send({ error: `Some error occurred: ${error}` });
  }
});

app.get("/search", async (req: any, res: any) : Promise<ISearchData | IError> => {
  ++concurrent;
  try {
    const searchQuery: string = req.query?.keyword as string;
    const page: number = parseInt(req.query?.page as string) || 1;
    const data: ISearchData | IError = await fetchSearch({keyword: searchQuery, page: page});
    if ("error" in data) {
      --concurrent;
      return res.status(400).send({ error: `Some error occurred: ${data.error}` });
    }
    --concurrent;
    ++served;
    return res.status(200).send(data);
  } catch (error) {
    --concurrent;
     return res.status(400).send({error: `Some error occurred: ${error}`});
  }
})

app.get("/info/:id", async (req: any, res: any) => {
  ++concurrent;
  try {
    const id: string = req.params.id;
    const data: IAnimeInfo | IError = await fetchInfo({id: id});
    // console.log(id);
    ++served;
    --concurrent;
    res.send(data);
  } catch (error) {
    --concurrent;
    res.status(400).send({error: `Some error occurred: ${error}`});
  }
})

app.get("/watch/:id", async (req: any, res: any) => {
  ++concurrent;
  try {
    const episode: string = req.query?.ep as string;
    const id: string = req.params.id + '?ep=' + episode;
    const data: IEpisodeSources | IError = await fetchEpisodeSource(id);
    // console.log(id);
    ++served;
    --concurrent;
    res.send(data);
  } catch (error) {
    --concurrent;
    res.status(400).send({error: `Some error occurred: ${error}`});
  }
})

setInterval(() => {
  console.log(`Served: ${served} Concurrent: ${concurrent}`);
}, 5000);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
