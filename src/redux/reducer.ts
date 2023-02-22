// import { combineReducers } from 'redux';
import { Action, InitialValueStore } from '../interface';

const initialState = new InitialValueStore();
const rootReducer = (state = initialState, action: Action<string, any>) => {
	switch (action.type) {
		case 'SET_AUTH':
			return {
				...state,
				auth: action.payload,
			};
		case 'GET_GENRES':
			return {
				...state,
				genres: action.payload,
			};
		case 'GET_TRENDING':
			return {
				...state,
				trending: action.payload,
			};
		case 'DISPLAY_MODEL_FULLSCREEN':
			return {
				...state,
				videoModel: {
					...state.videoModel,
					fullscreen: action.payload,
				},
			};
		case 'SET_DATA_MODEL':
			return {
				...state,
				videoModel: {
					...state.videoModel,
					...action.payload,
				},
			};
		case 'SET_TOP_POSITION':
			return {
				...state,
				videoModel: {
					...state.videoModel,
					topPosition: action.payload,
				},
			};
		case 'ADD_FAVOURITE':
			let indexItem = 0;
			const prevState = state.videoFavourite.find((item, index) => {
				indexItem = index;
				return item.id === action.payload.id;
			});
			if (prevState) {
				let newState = state.videoFavourite;
				newState.splice(indexItem, 1);
				return {
					...state,
					videoFavourite: [...newState],
				};
			}
			return {
				...state,
				videoFavourite: [...state.videoFavourite, action.payload],
			};
		case 'GET_SEARCH_DATA':
			let oldData = state.searchMovie.oldData;
			const existKeyword = oldData?.findIndex(
				(item) => item.keyword === action.payload.keyword,
			);

			if (existKeyword !== -1) {
				if (oldData) {
					oldData[existKeyword!].page = action.payload.page;
					oldData[existKeyword!].results = [
						...oldData[existKeyword!].results,
						...action.payload.results,
					];
				}
				return {
					...state,
					searchMovie: {
						keyword: action.payload.keyword,
						results: [...state.searchMovie.results, ...action.payload.results],
						page: action.payload.page,
						totalPages: action.payload.totalPages,
						oldData: oldData,
					},
				};
			} else {
				return {
					...state,
					searchMovie: {
						keyword: action.payload.keyword,
						results: [...action.payload.results],
						page: action.payload.page,
						totalPages: action.payload.totalPages,
						oldData: [
							...state.searchMovie?.oldData!,
							{
								keyword: action.payload.keyword,
								results: [...action.payload.results],
								page: action.payload.page,
								totalPages: action.payload.totalPages,
							},
						],
					},
				};
			}

		case 'GET_OLD_DATA':
			return {
				...state,
				searchMovie: {
					...state.searchMovie,
					keyword: action.payload.keyword,
					results: action.payload.results,
					page: action.payload.page,
					totalPages: action.payload.totalPages,
				},
			};
		case 'GET_MORE_DATA':
			return {
				...state,
				searchMovie: {
					...state.searchMovie,
					page: action.payload,
				},
			};
		case 'RESET_PAGE_SEARCH':
			return {
				...state,
				searchMovie: {
					...state.searchMovie,
					keyword: '',
					results: [],
					page: 1,
					totalPages: 0,
				},
			};
		default:
			return state;
	}
};

export default rootReducer;
