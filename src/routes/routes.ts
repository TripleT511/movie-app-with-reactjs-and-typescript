import FavouriteMovie from '../components/FavouriteMovie';
import GenreMovie from '../components/GenreMovie';
import config from '../config';
import { publicRoutes as publicRoutesInterface } from '../interface';
import Home from '../pages/Home';
import Search from '../pages/Search';

const publicRoutes: publicRoutesInterface[] = [
	{
		path: config.routes.root,
		component: Home,
		layout: 'default',
	},
	{
		path: config.routes.search,
		component: Search,
		layout: 'default',
	},
	{
		path: config.routes.mylist,
		component: FavouriteMovie,
		layout: 'default',
	},
	{
		path: config.routes.genre,
		component: GenreMovie,
		layout: 'default',
	},
];

export default publicRoutes;
