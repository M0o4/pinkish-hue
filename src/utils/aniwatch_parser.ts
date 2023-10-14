// import axios from 'axios'
// import {load} from 'cheerio'

const axios = require("axios");
const { load } = require("cheerio");

import {rapidCloudExtract} from "../source_extractor/extractor"

import type {
  IAnimeInfo,
  IEpisode,
  IEpisodeData,
  IEpisodeSources,
  IError,
  IRecentEpisodes,
  IRelatedAnime,
  ISearchData,
  ISearchResult,
  IVoiceActors,
} from "../types/aniwatch.d.ts";

const BASE_URL: string = "https://aniwatch.to";

const axiosInstance = axios.create({ baseURL: BASE_URL });

export const fetchRecentEpisodes = async ({
  page = 1,
}: {
  page: number;
}): Promise<IRecentEpisodes | IError> => {
  try {
    const { data } = await axiosInstance.get(`/recently-updated?page=${page}`);

    const $ = load(data);

    const hasNextPage =
      $(".pagination > li").length > 0
        ? $(".pagination > li").last().hasClass("active")
          ? false
          : true
        : false;

    const recentEpisodes: IEpisodeData[] = [];

    $("div.film_list-wrap > div").each((ind: any, ele: any) => {
      recentEpisodes.push({
        id: $(ele).find("div.film-poster > a").attr("href")?.replace("/", "")!,
        episodeNumber: parseInt(
          $(ele)
            .find("div.tick-sub")
            .text()
            .replace(/\s/g, "")
            .replace("Ep", "")
            .split("/")[0]
        ),
        title: $(ele).find("h3.film-name > a").attr("title")!,
        alternateTitle: $(ele).find("h3.film-name > a").attr("data-jname")!,
        image: $(ele).find("div.film-poster > img").attr("data-src")!,
        description: $(ele).find("div.film-detail > div.description").text()!,
        type: $(ele)
          .find("div.film-detail > div.fd-infor > span.fdi-item")
          .first()
          .text(),
        episodeDuration: $(ele)
          .find("div.film-detail > div.fd-infor > span.fdi-duration")
          .text()!,
        totalEpisodes: undefined,
      });
    });

    return {
      currentPage: page,
      hasNextPage: hasNextPage,
      results: recentEpisodes,
    };
  } catch (error) {
    return { error: `Some error occurred: ${error}` };
  }
};

export const fetchPopular = async ({
  page = 1,
}: {
  page: number;
}): Promise<IRecentEpisodes | IError> => {
  try {
    const { data } = await axiosInstance.get(`/top-airing?page=${page}`);

    const $ = load(data);

    const hasNextPage =
      $(".pagination > li").length > 0
        ? $(".pagination > li").last().hasClass("active")
          ? false
          : true
        : false;

    const popular: IEpisodeData[] = [];

    $("div.film_list-wrap > div").each((ind: any, ele: any) => {
      popular.push({
        id: $(ele).find("div.film-poster > a").attr("href")?.replace("/", "")!,
        episodeNumber: parseInt(
          $(ele)
            .find("div.tick-sub")
            .text()
            .replace(/\s/g, "")
            .replace("Ep", "")
            .split("/")[0]
        ),
        title: $(ele).find("h3.film-name > a").attr("title")!,
        alternateTitle: $(ele).find("h3.film-name > a").attr("data-jname")!,
        image: $(ele).find("div.film-poster > img").attr("data-src")!,
        description: $(ele)
          .find("div.film-detail > div.description")
          .text()
          .replace(/\s+/g, " ")!,
        type: $(ele)
          .find("div.film-detail > div.fd-infor > span.fdi-item")
          .first()
          .text(),
        episodeDuration: $(ele)
          .find("div.film-detail > div.fd-infor > span.fdi-duration")
          .text()!,
        totalEpisodes: undefined,
      });
    });

    return {
      currentPage: page,
      hasNextPage: hasNextPage,
      results: popular,
    };
  } catch (error) {
    return { error: `Some error occurred: ${error}` };
  }
};

export const fetchTrending = async () => {
  try {
    const { data } = await axiosInstance.get("/home");

    const $ = load(data);
    const result: IEpisodeData[] = [];
    
    $("div#slider > div.swiper-wrapper > div.swiper-slide").each(
      (ind: any, el: any) => {
        result.push({
          id: $(el)
            .find("div.desi-buttons > a.btn-secondary")
            .attr("href")
            ?.replace("/", "")!,
          episodeNumber: undefined,
          title: $(el).find("div.desi-head-title").text()!,
          alternateTitle: $(el).find("div.desi-head-title").attr("data-jname")!,
          image: $(el).find("img.film-poster-img").attr("data-src")!,
          description: $(el)
            .find("div.desi-description")
            .text()
            .replace(/\s+/g, " ")!,
          type: $(el).find("div.sc-detail > div.scd-item > i").first().text(),
          episodeDuration: $(el)
            .find("div.sc-detail > div.scd-item:nth-child(2)")
            .text().replace(/\s+/g, " ").trim()!,
          totalEpisodes: parseInt(
            $(el)
              .find("div.tick-sub")
              .text()
              .replace(/\s/g, "")
              .replace("Ep", "")
              .split("/")[0]
          ),
        });
      }
    );

    return result;
  } catch (error) {
    return { error: `Some error occurred: ${error}` };
  }
};

export const fetchSearch = async ({
  keyword,
  page = 1,
}: {
  keyword: string;
  page: number;
}): Promise<ISearchData | IError> => {
  if (keyword === undefined || keyword === "" || keyword == null)
    return { error: "No search query provided." };
  try {
    const { data } = await axiosInstance.get(
      `/search?keyword=${keyword}&page=${page}`
    );

    const $ = load(data);

    const hasNextPage =
      $(".pagination > li").length > 0
        ? $(".pagination > li").last().hasClass("active")
          ? false
          : true
        : false;

    const searchResults: ISearchResult[] = [];

    $("div.film_list-wrap > div").each((ind: any, ele: any) => {
      searchResults.push({
        id: $(ele).find("div.film-poster > a").attr("href")?.replace("/", "")!,
        title: $(ele).find("h3.film-name > a").attr("title")!,
        alternateTitle: $(ele).find("h3.film-name > a").attr("data-jname")!,
        image: $(ele).find("div.film-poster > img").attr("data-src")!,
        type: $(ele)
          .find("div.film-detail > div.fd-infor > span.fdi-item")
          .first()
          .text(),
        episodeDuration: $(ele)
          .find("div.film-detail > div.fd-infor > span.fdi-duration")
          .text()!,
        totalEpisodes: parseInt(
          $(ele)
            .find("div.tick-eps")
            .text()
            .replace(/\s/g, "")
            .replace("Ep", "")
            .split("/")[0]
        ),
      });
    });

    return {
      currentPage: page,
      hasNextPage: hasNextPage,
      results: searchResults,
    };
  } catch (error) {
    return { error: `Some error occurred: ${error}` };
  }
};

export const fetchInfo = async ({
  id,
}: {
  id: string;
}): Promise<IAnimeInfo | IError> => {
  if (id === undefined || id === "" || id == null)
    return { error: "No id provided." };

  try {
    const { data } = await axiosInstance.get(`/${id}`);
    // console.log(id);

    const $ = load(data);

    const info: IAnimeInfo = {
      id: id,
      title: "",
      image: "",
      type: "",
      episodeDuration: "",
      totalEpisodes: null,
      description: "",
      genres: [],
      status: "",
      releaseDate: "",
      rating: null,
      studios: [],
      otherNames: [],
      episodes: [],
      voiceActors: [],
      relations: [],
      recommendations: [],
      producers: [],
    };

    $("div.anisc-info-wrap > div.anisc-info > div.item").each(
      (ind: any, ele: any) => {
        const title = $(ele).find("span.item-head").text();
        switch (title) {
          case "Genres:":
            $(ele)
              .find("a")
              .each((ind: any, ele: any) => {
                info.genres.push($(ele).text().replace(/\s+/g, " "));
              });
            break;
          case "Studios:":
            $(ele)
              .find("a")
              .each((ind: any, ele: any) => {
                info.studios.push($(ele).text().replace(/\s+/g, " "));
              });
            break;
          case "Synonyms:":
            $(ele)
              .find("span.name")
              .each((ind: any, ele: any) => {
                info.otherNames.push($(ele).text().replace(/\s+/g, " "));
              });
            break;
          case "Japanese:":
            $(ele)
              .find("span.name")
              .each((ind: any, ele: any) => {
                info.otherNames.push($(ele).text().replace(/\s+/g, " "));
              });
            break;
          case "Premiered:":
            info.releaseDate = $(ele)
              .find("span.name")
              .text()
              .replace(/\s+/g, " ");
            break;
          case "Status:":
            info.status = $(ele).find("span.name").text().replace(/\s+/g, " ");
            break;
          case "Duration:":
            info.episodeDuration = $(ele)
              .find("span.name")
              .text()
              .replace(/\s+/g, " ");
            break;
          case "MAL Score:":
            info.rating = $(ele).find("span.name").text().replace(/\s+/g, " ");
            break;
          case "Overview:":
            info.description = $(ele)
              .find("div.text")
              .text()
              .replace(/\s+/g, " ");
            break;
          case "Producers:":
            $(ele)
              .find("a")
              .each((ind: any, ele: any) => {
                info.producers.push($(ele).text().replace(/\s+/g, " "));
              });
            break;
          default:
            break;
        }
      }
    );

    info.title = $("div.anisc-detail > h2.film-name")
      .text()
      .replace(/\s+/g, " ");
    info.image = $("div.anisc-poster > div.film-poster > img").attr("src");
    info.totalEpisodes = $("div.film-stats > div.tick > div.tick-sub")
      .text()
      .replace(/\s+/g, " ")
      .trim();
    info.type = $("div.film-stats > div.tick > span.item")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();

    $("div.bac-list-wrap > div.bac-item").each((ind: any, ele: any) => {
      info.voiceActors.push({
        name: $(ele)
          .find("div.rtl > div.pi-detail > h4.pi-name > a")
          .text()
          .replace(/\s+/g, " "),
        image: $(ele).find("div.rtl > a.pi-avatar > img").attr("data-src"),
        role: $(ele)
          .find("div.ltr > div.pi-detail > span.pi-cast")
          .text()
          .replace(/\s+/g, " "),
        cast: $(ele)
          .find("div.rtl > div.pi-detail > span.pi-cast")
          .text()
          .replace(/\s+/g, " "),
        characterName: $(ele)
          .find("div.ltr > div.pi-detail > h4.pi-name > a")
          .text()
          .replace(/\s+/g, " "),
        characterImage: $(ele)
          .find("div.ltr > a.pi-avatar > img")
          .attr("data-src"),
      });
    });

    $(
      "div.cbox-collapse > div.cbox-content > div.anif-block-ul > ul > li"
    ).each((ind: any, ele: any) => {
      const nameAnchor = $(ele).find("div.film-detail > h3.film-name a");
      const typeDiv = $(ele).find("div.film-detail > div.fd-infor > div.tick");
      info.relations.push({
        id: nameAnchor.attr("href")?.replace("/", "")!,
        title: nameAnchor.attr("title"),
        alternateTitle: nameAnchor.attr("data-jname"),
        image: $(ele).find("div.film-poster > img").attr("data-src"),
        type: typeDiv
          .contents()
          .filter(function (this: any) {
            return this.nodeType === 3;
          })
          .text()
          .replace(/\s+/g, " ")
          .trim(),
        episodeDuration: null,
        totalEpisodes: parseInt(
          typeDiv
            .find("div.tick-sub")
            .text()
            .replace("Ep", "")
            .replace(/\s+/g, " ")
            .trim()
        ),
      });
    });

    $("div.film_list-wrap > div.flw-item").each((ind: any, ele: any) => {
      info.recommendations.push({
        id: $(ele).find("div.film-poster > a").attr("href")?.replace("/", "")!,
        title: $(ele).find("h3.film-name > a").attr("title"),
        alternateTitle: $(ele).find("h3.film-name > a").attr("data-jname"),
        image: $(ele).find("div.film-poster > img").attr("data-src"),
        type: $(ele)
          .find("div.film-detail > div.fd-infor > span.fdi-item")
          .first()
          .text()
          .replace(/\s+/g, " ")
          .trim(),
        episodeDuration: $(ele)
          .find("div.film-detail > div.fd-infor > span.fdi-duration")
          .text()
          .replace(/\s+/g, " ")
          .trim(),
        totalEpisodes: parseInt(
          $(ele)
            .find("div.tick-eps")
            .text()
            .replace("Ep", "")
            .replace(/\s+/g, " ")
            .trim()
        ),
      });
    });

    const episodePage = await axiosInstance.get(
      `/ajax/v2/episode/list/${id.split("-").pop()}`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Referer: `${BASE_URL}/watch/${id}`,
        },
      }
    );
    const episodePageData = episodePage.data.html;

    const $$ = load(episodePageData);

    $$("div.ss-list > a").each((ind: any, ele: any) => {
      info.episodes.push({
        id: $$(ele).attr("href")?.split("/")[2]!,
        episodeNumber: parseInt(
          $$(ele)
            .find("div.ssli-order")
            .text()
            .replace("Ep", "")
            .replace(/\s+/g, " ")
            .trim()
        ),
        title: $$(ele).find("div.ssli-order").attr("title"),
      });
    });

    return info;
  } catch (error) {
    return { error: `Some error occurred: ${error}` };
  }
};


export const fetchEpisodeSource = async (
  id: string
): Promise<IEpisodeSources[] | IEpisodeSources | IError> => {
  if (id === undefined || id === "" || id == null)
    return { error: "No id provided." };

  try {
    if (id.startsWith("http")) {
      const serverUrl = new URL(id);
      return {
        ...(await rapidCloudExtract(serverUrl, axiosInstance, axios)),
      };
    }

    // console.log(id.split('?ep=')[1]);
    const { data } = await axiosInstance.get(
      `${BASE_URL}/ajax/v2/episode/servers?episodeId=${id.split("?ep=")[1]}`
    );

    const $ = load(data.html);

    const serverId: any[] = $("div.servers-sub > div.ps__-list > div.server-item")
      .map((ind: any, ele: any) => {
        const server = {
          name: $(ele).text().replace(/\s/g, ""),
          id: $(ele).attr("data-id"),
        }
        return server;
      })
    // console.log(serverId);
    if (!serverId) throw new Error("VidStreaming not found! Try other server");
    const response_data : IEpisodeSources[] = [];
    for (const server of serverId) {
      const {data: { link }} = await axiosInstance.get(
        `${BASE_URL}/ajax/v2/episode/sources?id=${server.id}`
      );
      const episodeSourceData = await fetchEpisodeSource(link);
      if ('server' in episodeSourceData) {
        episodeSourceData.server = server.name;
        response_data.push(episodeSourceData);
      }
    }
    return response_data;
  } catch (error) {
    return { error: `Some error occurred: ${error}` };
  }
};