import axios, { AxiosRequestConfig } from 'axios';

const request = axios.create({
	baseURL: 'https://api.themoviedb.org/',
});

// const requestImage = axios.create({
// 	baseURL: 'https://image.tmdb.org/t/p/',
// });

export const get = async (path: string, options: AxiosRequestConfig = {}) => {
	const response = await request.get(path, options);

	return response.data;
};

export default request;
