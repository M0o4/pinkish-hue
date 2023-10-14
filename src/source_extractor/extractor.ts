import { IEpisodeSources, IError } from "aniwatch";

const CryptoJS = require("crypto-js");

const fallBackKey: string = "c1d17096f2ca11b7";
const rapidCloudHost: string = "https://rapid-cloud.co";

async function rapidCloudExtract(
  url: URL,
  axiosInstance: any,
  axios: any
): Promise<IEpisodeSources | IError> {
  let videoSources = [];
  const result: {
    sources: any;
    subTitles: any;
    intro: { start: number; end: number };
    outro: { start: number; end: number };
    server: string;
  } = {
    sources: [],
    subTitles: [],
    intro: {
      start: 0,
      end: 0,
    },
    outro: {
      start: 0,
      end: 0,
    },
    server: "",
  };
  try {
    const id = url.href.split("/").pop()?.split("?")[0];
    const options = {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    };
    const response = await axiosInstance.get(
      `https://${url.hostname}/embed-2/ajax/e-1/getSources?id=${id}`,
      options
    );

    let {
      data: { sources, tracks, intro, outro, encrypted },
    } = response;
    //   console.log(response);

    const decrypt = await (
      await axios.get("https://github.com/enimax-anime/key/blob/e6/key.txt")
    ).data;

    const blobString = '"blob-code blob-code-inner js-file-line">';
    const afterIndex = decrypt.indexOf(
      '"blob-code blob-code-inner js-file-line">'
    );
    const newblobString =
      afterIndex == -1 ? "" : decrypt.substring(afterIndex + blobString.length);
    const beforeIndex = newblobString.indexOf("</td>");
    let decryptKey =
      beforeIndex == -1 ? "" : newblobString.substring(0, beforeIndex);

    if (!decryptKey) {
      decryptKey = await (
        await axios.get(
          "https://raw.githubusercontent.com/enimax-anime/key/e6/key.txt"
        )
      ).data;
    }

    let key = !decryptKey ? fallBackKey : decryptKey;

    if (encrypted) {
      const sourcesArray = sources.split("");
      let extractedKey = "";
      for (const index of decryptKey) {
        for (let i = index[0]; i < index[1]; i++) {
          extractedKey += sources[i];
          sourcesArray[i] = "";
        }
      }
      key = extractedKey;

      sources = sourcesArray.join("");

      const decrypt = CryptoJS.AES.decrypt(sources, key);
      sources = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
    }

    videoSources = sources?.map((source: any) => ({
      url: source.file,
      isM3U8: source.file.includes(".m3u8"),
    }));

    // console.log(await axiosInstance.get(sources[0].file.toString()));

    result.sources.push(...videoSources);
    result.sources = [];
    videoSources = [];
    for (const source of sources) {
      const { data } = await axiosInstance.get(source.file, options);
      const m3u8Data = data
        .split("\n")
        .filter(
          (line: string) =>
            line.includes(".m3u8") && line.includes("RESOLUTION=")
        );
      const resData = m3u8Data.map((line: string) =>
        line
          .match(/RESOLUTION=.*,(C)|URI=.*/g)
          ?.map((s: string) => s.split("=")[1])
      );
      const resArray = resData.map((s: string[]) => {
        const x = s[0].split(",C")[0];
        const y = s[1].replace(/"/g, "");
        return [x, y];
      });
      for (const [x, y] of resArray) {
        videoSources.push({
          url: `${source.file?.split("master.m3u8")[0]}${y.replace(
            "iframes",
            "index"
          )}`,
          quality: x.split("x")[1] + "p",
          isM3U8: y.includes(".m3u8"),
        });
      }
      result.sources.push(...videoSources);
    }

    if (intro?.end > 1) {
      result.intro = {
        start: intro.start,
        end: intro.end,
      };
    }

    if (outro?.end > 1) {
      result.outro = {
        start: outro.start,
        end: outro.end,
      };
    }

    result.sources.push({
      url: sources[0].file,
      isM3U8: sources[0].file?.includes(".m3u8"),
      quality: "default",
    });

    result.subTitles = tracks
      .map((source: any) => {
        return source.file
          ? {
              url: source.file,
              lang: source.label ? source.label : "Thumbnails",
            }
          : null;
      })
      .filter((source: any) => source != null);
    return result;
  } catch (error) {
    return { error: `Some error occurred: ${error}` };
  }
}

export { rapidCloudExtract };
