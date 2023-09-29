<p align="center">
  <a href="https://github.com/Anuragkumarsah/pinkish-hue">
    <img src="images/image1.png" alt="Logo" width="90" height="90">
  </a>

  <h3 align="center">Pinkish Hue API</h3>

  <p align="center">
    <samp>A free anime streaming restful API serving anime from <a href="https://aniwatch.to/">Aniwatch.to</a> (formerly known as Zoro.to)</samp>
    <br />
    <a href="#routes"><strong>Explore the api »</strong></a>
    <br />
    <samp><i>Please don't abuse the api, deploy your own copy of the api for free using the providers given below.</i></samp>
    <br />
  </p>
</p>

<h1> Table of Contents </h1>

- [Installation](#installation)
  - [Local](#local)
  - [Vercel](#Vercel)
- [Routes](#routes)
  - [Get Recent Episodes](#get-recent-episodes)
  - [Get Popular Anime](#get-popular-anime)
  - [Get Anime Search](#get-anime-search)
  - [Get Anime Details](#get-anime-details)
  - [Get Streaming URLs](#get-streaming-urls)
    - [Vidstreaming](#vidstreaming)
- [Contributing](#contributing)

## Installation

### Local
Run the following command to clone the repository, and install the dependencies:

```sh
git clone https://github.com/Anuragkumarsah/pinkish-hue.git
cd pinkish-hue
npm install #or yarn install
```

start the server with the following command:

```sh
npm start #or yarn start
```
Now the server is running on http://localhost:3000

### Vercel
Host your own instance of the api on Vercel using the button below.

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Anuragkumarsah/pinkish-hue)

### Railway
Host your own instance of the api on Railway using the button below.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/CJ1jmh?referralCode=mzHUTS)

## Routes
Below you'll find examples using [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) but you can use any other http library out there.

### Get Recent Episodes

| Parameter    | Description                                                                                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` (int) |                                                                                                               |

```js
fetch("https://pinkish-hue.vercel.app/recent-episodes")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
{
    "currentPage": 1,
    "hasNextPage": true,
    "results": [{
            "id": "zom-100-bucket-list-of-the-dead-18423",
            "episodeNumber": 9,
            "title": "Zom 100: Bucket List of the Dead",
            "alternateTitle": "Zom 100: Zombie ni Naru made ni Shitai 100 no Koto",
            "image": "https://img.flawlessfiles.com/_r/300x400/100/f6/b0/f6b0c0889e49de49b34b3e72fbecbfdf/f6b0c0889e49de49b34b3e72fbecbfdf.png",
            "description": "\n            In a trash-filled apartment, 24-year-old Akira Tendou watches a zombie movie with lifeless, envious eyes. After spending three hard years at an exploitative corporation in Japan, his spirit is broken. He can't even muster the courage to confess his feelings to his beautiful co-worker Ootori. Then one morning, he stumbles upon his landlord eating lunch—which happens to be another tenant! The whole city's swarming with zombies, and even though he's running for his life, Akira has never felt more alive!\n        ",
            "type": "TV",
            "episodeDuration": "23m",
            "totalEpisodes": null
    },
    {...},
    ...]
}
```

### Get Popular Anime

| Parameter    | Description         |
| ------------ | ------------------- |
| `page` (int) | page limit may vary  |

```js
fetch("https://pinkish-hue.vercel.app/popular")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "one-piece-100",
      "episodeNumber": 1077,
      "title": "One Piece",
      "alternateTitle": "One Piece",
      "image": "https://img.flawlessfiles.com/_r/300x400/100/54/90/5490cb32786d4f7fef0f40d7266df532/5490cb32786d4f7fef0f40d7266df532.jpg",
      "description": " Gold Roger was known as the \"Pirate King,\" the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King. Enter Monkey Luffy, a 17-year-old boy who defies your standard definition of a pirate. Rather than the popular persona of a wicked, hardened, toothless pirate ransacking villages for fun, Luffy's reason for being a pirate is one of pure wonder: the thought of an exciting adventure that leads him to intriguing people and ultimately, the promised treasure. Following in the footsteps of his childhood hero, Luffy and his crew travel across the Grand Line, experiencing crazy adventures, unveiling dark mysteries and battling strong enemies, all in order to reach the most coveted of all fortunes—One Piece. [Written by MAL Rewrite] ",
      "type": "TV",
      "episodeDuration": "24m",
      "totalEpisodes": null
    },
    {...},
    ...]
}
```

### Get Anime Search

| Parameter       | Description         |
| --------------- | ------------------- |
| `keyword` (string) | anime title      |
| `page` (int)    | page limit may vary |

```js
fetch("https://pinkish-hue.vercel.app/search?keyword=rezero")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
        {
        "id": "rezero-starting-life-in-another-world-2nd-season-part-2-15526",
        "title": "Re:Zero - Starting Life in Another World 2nd Season (Part 2)",
        "alternateTitle": "Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season Part 2",
        "image": "https://img.flawlessfiles.com/_r/300x400/100/b9/01/b901e36b53189d739740f0e5edb96459/b901e36b53189d739740f0e5edb96459.jpg",
        "type": "TV",
        "episodeDuration": "28m",
        "totalEpisodes": 12
      },
      {...},
      ...]
}
```
### Get Anime Details

| Parameter      | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| `:id` (string) | **id can be found in every response body as can be seen in the above examples** |

```js
fetch("https://pinkish-hue.vercel.app/info/rezero-starting-life-in-another-world-2nd-season-part-2-15526")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
{
    "id": "rezero-starting-life-in-another-world-2nd-season-part-2-15526",
    "title": "Re:Zero - Starting Life in Another World 2nd Season (Part 2)",
    "image": "https://img.flawlessfiles.com/_r/300x400/100/b9/01/b901e36b53189d739740f0e5edb96459/b901e36b53189d739740f0e5edb96459.jpg",
    "type": "TV",
    "episodeDuration": "28m",
    "totalEpisodes": "12",
    "description": " After the battle with the Witch Cult, Subaru travels back to Crusch's manor with Emilia, when he discovers, to his horror, that everyone has forgotten Rem. Earlier, she and Crusch were ambushed by the Sin Archbishops of Gluttony, Lye Batenkaitos, and Greed, Regulus Corneus. Although they fought fiercely, both ended up having their existences eaten by Lye. This caused Rem to fall into a coma.....",
    "genres": ["Drama", "Fantasy", "Psychological", "Thriller"],
    "status": "Finished Airing",
    "releaseDate": "Winter 2021",
    "rating": "?",
    "studios": [ "White Fox"],
    "otherNames": ["Re：ゼロから始める異世界生活", "Re: Life in a different world from zero 2nd Season, ReZero 2nd Season, Re:Zero - Starting Life in Another World 2"],
    "episodes": [
        {
          "id": "rezero-starting-life-in-another-world-2nd-season-part-2-15526?ep=51486",
          "episodeNumber": 1
        },
        {...},
        ...],
    "voiceActors": [
      {
        "name": "Takahashi, Rie",
        "image": "https://img.flawlessfiles.com/_r/100x100/100/41/19/41192ea8832d0c749f16b87f1f6dc7cf/41192ea8832d0c749f16b87f1f6dc7cf.jpg",
        "role": "Main",
        "cast": "Japanese",
        "chacacterName": "Emilia",
        "characterImage": "https://img.flawlessfiles.com/_r/100x100/100/81/c1/81c11925ce431590da4eb2885beb893b/81c11925ce431590da4eb2885beb893b.jpg"
      }, {...}, ...],
    "relations": [
      {
        "id": "rezero-starting-life-in-another-world-season-2-54",
        "title": "Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season",
        "alternateTitle": "Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season",
        "image": "https://img.flawlessfiles.com/_r/300x400/100/04/c2/04c2420fa1e0c987f04ae6d20d40065f/04c2420fa1e0c987f04ae6d20d40065f.jpg",
        "type": "TV",
        "episodeDuration": null,
        "totalEpisodes": 13
      }, {...}, ...],
    "recommendations": [
      {
        "id": "mardock-scramble-the-second-combustion-1970",
        "title": "Mardock Scramble: The Second Combustion",
        "alternateTitle": "Mardock Scramble: The Second Combustion",
        "image": "https://img.flawlessfiles.com/_r/300x400/100/13/a3/13a33931cb652c4b613731271bd004eb/13a33931cb652c4b613731271bd004eb.jpg",
        "type": "Movie",
        "episodeDuration": "64m",
        "totalEpisodes": null
      }, {...}, ...],
    "producers": [
      "White Fox",
      "Kadokawa"
    ]
}
```

### Get Streaming URLs

| Parameter      | Description                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `:id` (string) | episodeId. **To verify the id of each episode, look at the episodesList property in the [example above](#get-anime-details).** |

#### Vidstreaming

```js
fetch("https://pinkish-hue.vercel.app/watch/rezero-starting-life-in-another-world-2nd-season-part-2-15526?ep=51486")
  .then((response) => response.json())
  .then((animelist) => console.log(animelist));
```

Output >>

```json
{
  "sources": [
    {
      "url": "https://eno.tendoloads.com/_v6/0d61cc5d5ebc427227f8651e054241b7c53b82b079435c1a10c2e7b602668a08a8ab0c28ac532f410caf47c9563eaec49dd3fb2f38652605935b463d5b234d0df3c33e7ebb39af5dc817b0a8eef7dff1e48d8b6d7d640dbb111dd70318682c99d3ebad4b59907b7dbb4e3e21b5545a7938f908f987a305f4087b07f8fe2523b3/index-f1-v1-a1.m3u8",
      "quality": "1080p",
      "isM3U8": true
    },
    {
      "url": "https://eno.tendoloads.com/_v6/0d61cc5d5ebc427227f8651e054241b7c53b82b079435c1a10c2e7b602668a08a8ab0c28ac532f410caf47c9563eaec49dd3fb2f38652605935b463d5b234d0df3c33e7ebb39af5dc817b0a8eef7dff1e48d8b6d7d640dbb111dd70318682c99d3ebad4b59907b7dbb4e3e21b5545a7938f908f987a305f4087b07f8fe2523b3/index-f2-v1-a1.m3u8",
      "quality": "720p",
      "isM3U8": true
    },
    {
      "url": "https://eno.tendoloads.com/_v6/0d61cc5d5ebc427227f8651e054241b7c53b82b079435c1a10c2e7b602668a08a8ab0c28ac532f410caf47c9563eaec49dd3fb2f38652605935b463d5b234d0df3c33e7ebb39af5dc817b0a8eef7dff1e48d8b6d7d640dbb111dd70318682c99d3ebad4b59907b7dbb4e3e21b5545a7938f908f987a305f4087b07f8fe2523b3/index-f3-v1-a1.m3u8",
      "quality": "360p",
      "isM3U8": true
    },
    {
      "url": "https://eno.tendoloads.com/_v6/0d61cc5d5ebc427227f8651e054241b7c53b82b079435c1a10c2e7b602668a08a8ab0c28ac532f410caf47c9563eaec49dd3fb2f38652605935b463d5b234d0df3c33e7ebb39af5dc817b0a8eef7dff1e48d8b6d7d640dbb111dd70318682c99d3ebad4b59907b7dbb4e3e21b5545a7938f908f987a305f4087b07f8fe2523b3/master.m3u8",
      "isM3U8": true,
      "quality": "default"
    }
  ],
  "subTitles": [
    {
      "url": "https://ccb.megaresources.co/df/da/dfda112931c143c1e40d70421ee41dce/ara-10.vtt",
      "lang": "Arabic"
    },
    {
      "url": "https://ccb.megaresources.co/df/da/dfda112931c143c1e40d70421ee41dce/eng-2.vtt",
      "lang": "English"
    },
    {...},
    ... 
  ],
  "intro": {
    "start": 0,
    "end": 0
  }
}
```

## Contributing
1. [Fork the repository](https://github.com/Anuragkumarsah/pinkish-hue)
2. Clone your fork to your local machine using the following command **(make sure to change `<your_username>` to your GitHub username)**:
```sh
git clone https://github.com/<your-username>/pinkish-hue.git
```
3. Create a new branch: `git checkout -b <new-branch-name>` (e.g. `git checkout -b my-new-branch`)
4. Make your changes.
5. Stage the changes: `git add .`
6. Commit the changes: `git commit -m "My commit message"`
7. Push the changes to GitHub: `git push origin <new-branch-name>` (e.g. `git push origin my-new-branch`)
8. Open a pull request.