import { Genres, Movie, searchMovie, UserInfo, VideoModel } from '../interface';

export const setAuth = (payload?: UserInfo) => {
	return {
		type: 'SET_AUTH',
		payload,
	};
};

export const getGenres = (payload: Genres[]) => {
	return {
		type: 'GET_GENRES',
		payload,
	};
};

export const getMovieTrending = (payload: Movie[]) => {
	return {
		type: 'GET_TRENDING',
		payload,
	};
};

export const setBillboardVideo = (payload: string) => {
	return {
		type: 'SET_BILLBOARD_VIDEO',
		payload,
	};
};

export const setDisplayModelFullScreen = (payload: boolean) => {
	return {
		type: 'DISPLAY_MODEL_FULLSCREEN',
		payload,
	};
};

export const setDataModel = (payload: VideoModel) => {
	return {
		type: 'SET_DATA_MODEL',
		payload,
	};
};

export const addMovieFavourite = (payload: Movie) => {
	return {
		type: 'ADD_FAVOURITE',
		payload,
	};
};

export const setTopPositionModel = (payload: string) => {
	return {
		type: 'SET_TOP_POSITION',
		payload,
	};
};

export const getSearchData = (payload: searchMovie) => {
	return {
		type: 'GET_SEARCH_DATA',
		payload,
	};
};

export const resetPageSearch = () => {
	return {
		type: 'RESET_PAGE_SEARCH',
	};
};

export const getMoreSearchData = (payload: number) => {
	return {
		type: 'GET_MORE_DATA',
		payload,
	};
};
