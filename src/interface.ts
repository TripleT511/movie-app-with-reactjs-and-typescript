import { ReactNode } from 'react';

export interface ChildrenProps {
	children: ReactNode;
}

export interface UseDebounceProps {
	value: any;
	delay: number;
}

export interface publicRoutes {
	path: string;
	component: React.FC;
	layout?: string;
}

export interface MenuItemProps {
	title: string;
	to: string;
}

export interface MenuProps {
	data: MenuItemProps[];
}

export interface Action<A, B> {
	readonly type: A;
	readonly payload?: B;
}

export interface Movie {
	id: number;
	adult: boolean;
	backdrop_path: string;
	genres: Genres[];
	original_name?: string;
	original_title?: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	runtime: number;
	name?: string;
	title?: string;
	vote_average: number;
	vote_count: number;
	lstVideo?: VideoRelated;
}

export interface Genres {
	id: number;
	name: string;
}

export interface MovieDetails extends Movie {
	status: string;
	tagline: string;
}

export interface Image {
	aspect_ratio: number;
	height: number;
	iso_639_1: boolean;
	file_path: string;
	vote_average: number;
	vote_count: number;
	width: number;
}

export interface ImageRelated {
	id: number;
	backdrops: Image[];
	logos: Image[];
	posters: Image[];
}

export interface Videos {
	name?: string;
	title?: string;
	key: string;
	type: string;
}

export interface VideoRelated {
	id?: number;
	results?: Videos[];
}

export interface VideoModel {
	showModel?: boolean;
	idMovie?: number;
	fullscreen?: boolean;
	topPosition?: string;
}

export interface UserInfo {
	displayName: string;
	email: string;
	phoneNumber: string;
	photoURL: string;
	providerId: string;
}

export interface searchMovie {
	keyword: string;
	results: MovieDetails[];
	page: number;
	totalPages: number;
	oldData?: searchMovie[];
}

export class InitialValueStore {
	auth?: UserInfo;
	videoModel: VideoModel = {
		idMovie: undefined,
		fullscreen: false,
	};
	videoFavourite: MovieDetails[] = [];
	genres: Genres[] = [];
	trending: Movie[] = [];
	searchMovie: searchMovie = {
		keyword: '',
		results: [],
		page: 1,
		totalPages: 0,
		oldData: [],
	};
}

export interface VideoState {
	videoRelated: VideoRelated;
	videoVolumeClicked: boolean;
	trailerCurrent?: Videos;
	isVideoEnd: boolean;
	isVideoStart: boolean;
}

export interface SliderProps {
	name: string;
	genres_id: number;
}

export interface Offset {
	start: number;
	end: number;
}

export interface stateSlider {
	lstMovie: Movie[];
	lstMovieActive: Movie[];
	show: number;
	offsetCurrent: {
		next: number;
		prev: number;
	};
	offsetActive: Offset;
	showPrev: boolean;
	styles: string;
	length: number;
	lstPrev: number[][];
	lstNext: number[][];
}

export interface SliderItemProps {
	banner: string;
	active?: boolean;
	movie: Movie;
}

export interface BillBoardState {
	id: number;
	src: string;
	title?: string;
	name?: string;
	video?: VideoRelated;
	overview: string;
}

export interface Cast {
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	profile_path: string;
	character: string;
	order: number;
}

export interface Crew {
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	profile_path: string;
	department: string;
	job: string;
}

export interface GetMoreSearchData {
	results: MovieDetails[];
	page: number;
}
