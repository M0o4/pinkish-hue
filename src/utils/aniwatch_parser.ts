// import axios from 'axios'
// import {load} from 'cheerio'

const axios = require("axios");
const { load } = require("cheerio");
const CryptoJS = require("crypto-js");

import type { IAnimeInfo, IEpisode, IEpisodeData, IEpisodeSources, IError, IRecentEpisodes, IRelatedAnime, ISearchData, ISearchResult, IVoiceActors } from "../types/aniwatch.d.ts";

const BASE_URL: string = "https://aniwatch.to";

const axiosInstance = axios.create({ baseURL: BASE_URL });


const fallBackKey : string = 'c1d17096f2ca11b7';
const rapidCloudHost : string = 'https://rapid-cloud.co';

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
        description: $(ele).find("div.film-detail > div.description").text().replace(/\s+/g, ' ')!,
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


export const fetchInfo = async ({ id } : {id : string}) : Promise<IAnimeInfo | IError> => {

  if(id === undefined || id === '' || id == null) return {error: "No id provided."};

  try {
      const {data} = await axiosInstance.get(`/${id}`);
      // console.log(id);

      const $ = load(data);

      const info : IAnimeInfo = {
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
      } 

      $('div.anisc-info-wrap > div.anisc-info > div.item').each((ind: any, ele: any) => {
          const title = $(ele).find('span.item-head').text();
          switch(title) {
              case "Genres:":
                  $(ele).find('a').each((ind: any, ele: any) => {
                      info.genres.push($(ele).text().replace(/\s+/g, ' '));
                  })
                  break;
              case "Studios:":
                  $(ele).find('a').each((ind: any, ele: any) => {
                      info.studios.push($(ele).text().replace(/\s+/g, ' '));
                  })
                  break;
              case "Synonyms:":
                  $(ele).find('span.name').each((ind: any, ele: any) => {
                      info.otherNames.push($(ele).text().replace(/\s+/g, ' '));
                  })
                  break;
              case "Japanese:":
                $(ele).find('span.name').each((ind: any, ele: any) => {
                    info.otherNames.push($(ele).text().replace(/\s+/g, ' '));
                })
              break;
              case "Premiered:":
                  info.releaseDate = $(ele).find('span.name').text().replace(/\s+/g, ' ');
                  break;
              case "Status:":
                  info.status = $(ele).find('span.name').text().replace(/\s+/g, ' ');
                  break;
              case "Duration:":
                  info.episodeDuration = $(ele).find('span.name').text().replace(/\s+/g, ' ');
                  break;
              case "MAL Score:":
                  info.rating = $(ele).find('span.name').text().replace(/\s+/g, ' ');
                  break;
              case "Overview:":
                  info.description = $(ele).find('div.text').text().replace(/\s+/g, ' ');
                  break;
              case "Producers:":
                  $(ele).find('a').each((ind: any, ele: any) => {
                      info.producers.push($(ele).text().replace(/\s+/g, ' '));
                  })
                  break;
              default:
                  break;
          }
      })
      
      info.title = $('div.anisc-detail > h2.film-name').text().replace(/\s+/g, ' ');
      info.image = $('div.anisc-poster > div.film-poster > img').attr('src');
      info.totalEpisodes = $('div.film-stats > div.tick > div.tick-sub').text().replace(/\s+/g, ' ').trim();
      info.type = $('div.film-stats > div.tick > span.item').first().text().replace(/\s+/g, ' ').trim();
      
      $('div.bac-list-wrap > div.bac-item').each((ind: any, ele: any) => {
          info.voiceActors.push({
            name: $(ele).find('div.rtl > div.pi-detail > h4.pi-name > a').text().replace(/\s+/g, ' '),
            image: $(ele).find('div.rtl > a.pi-avatar > img').attr('data-src'),
            role: $(ele).find('div.ltr > div.pi-detail > span.pi-cast').text().replace(/\s+/g, ' '),
            cast: $(ele).find('div.rtl > div.pi-detail > span.pi-cast').text().replace(/\s+/g, ' '),
            characterName: $(ele).find('div.ltr > div.pi-detail > h4.pi-name > a').text().replace(/\s+/g, ' '),
            characterImage: $(ele).find('div.ltr > a.pi-avatar > img').attr('data-src'),
          })
      })

      $('div.cbox-collapse > div.cbox-content > div.anif-block-ul > ul > li').each((ind: any, ele: any) => {

          const nameAnchor = $(ele).find('div.film-detail > h3.film-name a');
          const typeDiv = $(ele).find('div.film-detail > div.fd-infor > div.tick');
          info.relations.push({
              id: nameAnchor.attr('href')?.replace('/', '')!,
              title: nameAnchor.attr('title'),
              alternateTitle: nameAnchor.attr('data-jname'),
              image: $(ele).find('div.film-poster > img').attr('data-src'),
              type: typeDiv.contents().filter(function(this: any) {
                return this.nodeType === 3; 
              }).text().replace(/\s+/g, ' ').trim(),
              episodeDuration: null,
              totalEpisodes: parseInt(typeDiv.find('div.tick-sub').text().replace('Ep', '').replace(/\s+/g, ' ').trim()),
          })
        })
      
      $('div.film_list-wrap > div.flw-item').each((ind: any, ele: any) => {
          info.recommendations.push({
              id: $(ele).find('div.film-poster > a').attr('href')?.replace('/', '')!,
              title: $(ele).find('h3.film-name > a').attr('title'),
              alternateTitle: $(ele).find('h3.film-name > a').attr('data-jname'),
              image: $(ele).find('div.film-poster > img').attr('data-src'),
              type: $(ele).find('div.film-detail > div.fd-infor > span.fdi-item').first().text().replace(/\s+/g, ' ').trim(),
              episodeDuration: $(ele).find('div.film-detail > div.fd-infor > span.fdi-duration').text().replace(/\s+/g, ' ').trim(),
              totalEpisodes: parseInt($(ele).find('div.tick-eps').text().replace('Ep', '').replace(/\s+/g, ' ').trim()),
          })
        })
      

      const episodePage = await axiosInstance.get(`/ajax/v2/episode/list/${id.split('-').pop()}`, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            Referer: `${BASE_URL}/watch/${id}`,
          },
      });
      const episodePageData = episodePage.data.html;

      const $$ = load(episodePageData);

      $$('div.ss-list > a').each((ind: any, ele: any) => {
          info.episodes.push({
              id: $$(ele).attr('href')?.split('/')[2]!,
              episodeNumber: parseInt($$(ele).find('div.ssli-order').text().replace('Ep', '').replace(/\s+/g, ' ').trim()),
              title: $$(ele).find('div.ssli-order').attr('title'),
          })
      })
        
      return info;
  }catch (error) {
      return {error: `Some error occurred: ${error}`};
  }

}

async function rapidCloudExtract(url: URL) : Promise<IEpisodeSources | IError> {
    let videoSources = [];
    const result : {sources: any; subTitles: any; intro : {start : number; end: number}} = {
      sources: [],
      subTitles: [],
      intro: {
        start: 0,
        end: 0
      }
    }
    try {
      const id = url.href.split('/').pop()?.split('?')[0];
      const options = {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      };
      const response = await axiosInstance.get(
        `https://${url.hostname}/embed-2/ajax/e-1/getSources?id=${id}`,
        options
      );

      let {
        data: {sources, tracks, intro, encrypted}
      } = response;
      // console.log(sources);
      
      const decrypt = await (
        await axios.get('https://github.com/enimax-anime/key/blob/e6/key.txt')
      ).data;

      const blobString = '"blob-code blob-code-inner js-file-line">';
      const afterIndex = decrypt.indexOf('"blob-code blob-code-inner js-file-line">');
      const newblobString = afterIndex == -1 ? '' : decrypt.substring(afterIndex + blobString.length);
      const beforeIndex = newblobString.indexOf('</td>');
      let decryptKey = beforeIndex == -1 ? '' : newblobString.substring(0, beforeIndex);

      if(!decryptKey) {
        decryptKey = await (await axios.get('https://raw.githubusercontent.com/enimax-anime/key/e6/key.txt')).data;
      }

      let key = !decryptKey ? fallBackKey : decryptKey;

      if(encrypted) {
        const sourcesArray = sources.split('');
        let extractedKey = '';
        for (const index of decryptKey) {
          for (let i = index[0]; i < index[1]; i++) {
            extractedKey += sources[i];
            sourcesArray[i] = '';
          }
        }
        key = extractedKey;
        
        sources = sourcesArray.join('');


        const decrypt = CryptoJS.AES.decrypt(sources, key);
        sources = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
      }
      
      videoSources = sources?.map((source: any) => ({
        url: source.file,
        isM3U8: source.file.includes('.m3u8')
      }))

      // console.log(await axiosInstance.get(sources[0].file.toString()));
      

      result.sources.push(...videoSources);
          result.sources = [];
          videoSources = [];
          for(const source of sources) {
            const { data } = await axiosInstance.get(source.file, options);
            const m3u8Data = data.split('\n').filter((line : string) => line.includes('.m3u8') && line.includes('RESOLUTION='));
            const resData = m3u8Data.map((line : string) => 
            line.match(/RESOLUTION=.*,(C)|URI=.*/g)?.map((s: string) => s.split('=')[1])
            );
            const resArray = resData.map((s: string[]) => {
              const x = s[0].split(',C')[0];
              const y = s[1].replace(/"/g,'');
              return [x, y];
            });
            for(const [x, y] of resArray) {
              videoSources.push({
                url: `${source.file?.split('master.m3u8')[0]}${y.replace('iframes', 'index')}`,
                quality: x.split('x')[1]+'p',
                isM3U8: y.includes('.m3u8'),
              });
            }
            result.sources.push(...videoSources);
          }

      if(intro?.end > 1) {
        result.intro = {
          start: intro.start,
          end: intro.end
        }
      }

      result.sources.push({
        url: sources[0].file,
        isM3U8: sources[0].file?.includes('.m3u8'),
        quality: 'default'
      })
      

      result.subTitles = tracks.map((source: any) => {
        return source.file ? {
          url: source.file,
          lang: source.label ? source.label : 'Thumbnails',
        } : null
      }).filter((source: any) => source != null);
      return result;
    }catch (error){
      return {error: `Some error occurred: ${error}`};
    }
}


export const fetchEpisodeSource = async (id : string) : Promise<IEpisodeSources | IError> => {
  if(id === undefined || id === '' || id == null) return {error: "No id provided."};

  try{
    if(id.startsWith('http')) {
      const serverUrl = new URL(id);
      return {
        ...(await rapidCloudExtract(serverUrl)),
      }
    }

    // console.log(id.split('?ep=')[1]);
    const {data} = await axiosInstance.get(`${BASE_URL}/ajax/v2/episode/servers?episodeId=${id.split('?ep=')[1]}`);
    
    const $ = load(data.html);

    const serverId: any = $('div.servers-sub > div.ps__-list > div.server-item').map((ind : any, ele : any) => {
        return  ($(ele).attr('data-server-id') == '4' ? $(ele) : null)
    }).get()[0].attr('data-id');
    // console.log(serverId);
    if(!serverId) throw new Error('VidStreaming not found! Try other server');

    const { 
      data : { link }
    } = await axiosInstance.get(`${BASE_URL}/ajax/v2/episode/sources?id=${serverId}`);

    return await fetchEpisodeSource(link);

  }catch(error) {
    return {error: `Some error occurred: ${error}`};
  }
}