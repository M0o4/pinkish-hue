const express = require("express");
const cors = require("cors");
import type { IRecentEpisodes } from "./types/aniwatch.d.ts";
import { fetchRecentEpisodes, fetchPopular } from "./utils/aniwatch_parser";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: true,
  credentials: true,
  port: PORT,
};

app.use(cors(corsOptions));

app.get("/", (req: any, res: any) => {
  const homeinfo = {
    message: "Welcome to the Pinkish-Hue API! 🎉",
    "endpoints (working)": ["/recent-episodes", "/popular"],
    "endpoints (under development)": [
      "/info/:id",
      "/watch/:id",
      "/:search-query",
    ],
  };
  res.status(200).send(homeinfo);
});

app.get("/recent-episodes", async (req: any, res: any) => {
  try {
    const page: number = parseInt(req.query?.page as string) || 1;
    const data: IRecentEpisodes | string = await fetchRecentEpisodes({
      page: page,
    });
    return res.status(200).json(data);
  } catch (error) {
    res.status(400).send(`Some error occurred: ${error}`);
  }
});

app.get("/popular", async (req: any, res: any) => {
  try {
    const page: number = parseInt(req.query?.page as string) || 1;
    const data: IRecentEpisodes | string = await fetchPopular({ page: page });
    res.send(data);
  } catch (error) {
    res.status(400).send(`Some error occurred: ${error}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
