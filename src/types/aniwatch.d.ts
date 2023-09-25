export type IRecentEpisodes = {
    currentPage: number;
    hasNextPage: boolean;
    results: IEpisodeData[];
}

export type IEpisodeData = {
    id: string;
    episodeNumber: number;
    title: string;
    alternateTitle: string;
    image: string;
    description: string;
    type: string;
    episodeDuration: string;
    totalEpisodes: number | null;
}

export type ISearchData = {
    currentPage: number;
    hasNextPage: boolean;
    results: ISearchResult[];
}

export type ISearchResult = {
    id: string;
    title: string;
    alternateTitle: string;
    image: string;
    type: string;
    episodeDuration: string;
    totalEpisodes: number | null;
}

export type IError = {
    error: string;
}