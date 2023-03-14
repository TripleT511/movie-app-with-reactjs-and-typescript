import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class Http {
	instance: AxiosInstance;
	constructor() {
		this.instance = axios.create({
			baseURL: 'https://api.themoviedb.org/',
			timeout: 10000,
		});
	}
}

const http = new Http().instance;

export const get = async (path: string, options: AxiosRequestConfig = {}) => {
	const response = await http.get(path, options);

	return response.data;
};

export default http;
