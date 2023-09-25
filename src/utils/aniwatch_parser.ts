// import axios from 'axios'
// import {load} from 'cheerio'

const axios = require("axios");
const { load } = require("cheerio");

import type { IEpisodeData, IError, IRecentEpisodes, ISearchData, ISearchResult } from "../types/aniwatch.d.ts";

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
        totalEpisodes: null,
      });
    });

    return {
      currentPage: page,
      hasNextPage: hasNextPage,
      results: recentEpisodes,
    };
  } catch (error) {
    return {error: `Some error occurred: ${error}`};
  }
};

export const fetchPopular = async ({
  page = 1,
}: {
  page: number;
}) : Promise<IRecentEpisodes | IError> => {
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
        description: $(ele).find("div.film-detail > div.description").text()!,
        type: $(ele)
          .find("div.film-detail > div.fd-infor > span.fdi-item")
          .first()
          .text(),
        episodeDuration: $(ele)
          .find("div.film-detail > div.fd-infor > span.fdi-duration")
          .text()!,
        totalEpisodes: null,
      });
    });

    return {
        currentPage: page,
        hasNextPage: hasNextPage,
        results: popular,
    };
  } catch (error) {
    return {error: `Some error occurred: ${error}`};
  }
};



export const fetchSearch = async ({ keyword, page = 1 } : {keyword : string, page : number}) : Promise<ISearchData | IError> => {
    if(keyword === undefined || keyword === '' || keyword == null) return {error: "No search query provided."};
    try {
        const { data } = await axiosInstance.get(`/search?keyword=${keyword}&page=${page}`);

        const $ = load(data);

        const hasNextPage = $(".pagination > li").length > 0 ? ($(".pagination > li").last().hasClass("active") ? false : true) : false;
        
        const searchResults: ISearchResult[] = [];

        $("div.film_list-wrap > div").each((ind: any, ele: any) => {
            searchResults.push({
                id: $(ele).find("div.film-poster > a").attr("href")?.replace("/", "")!,
                title: $(ele).find("h3.film-name > a").attr("title")!,
                alternateTitle: $(ele).find("h3.film-name > a").attr("data-jname")!,
                image: $(ele).find("div.film-poster > img").attr("data-src")!,
                type: $(ele).find("div.film-detail > div.fd-infor > span.fdi-item").first().text(),
                episodeDuration: $(ele).find("div.film-detail > div.fd-infor > span.fdi-duration").text()!,
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
        return {error: `Some error occurred: ${error}`};
    }
}