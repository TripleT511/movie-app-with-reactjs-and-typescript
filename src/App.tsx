import { ExoticComponent, Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './components/SignUp';
import config from './config';
import routes from './config/routes';
import { ChildrenProps } from './interface';
import Layout from './layouts/Layout';
import publicRoutes from './routes/routes';
import request from './utils/httpRequest';

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		const getGenres = async () => {
			const res = await request('3/genre/movie/list', {
				params: {
					api_key: config.api_key,
				},
			});

			return res;
		};
		getGenres()
			.then(async (res) => {
				const payload = res.data.genres;
				dispatch({ type: 'GET_GENRES', payload });
			})
			.catch(console.error);
	});

	return (
		<BrowserRouter>
			<div className="App">
				<Routes>
					{publicRoutes &&
						publicRoutes.map((route, index) => {
							const Page = route.component;
							let LayoutComponent: ExoticComponent | React.FC<ChildrenProps> =
								Layout;
							if (!route.layout) LayoutComponent = Fragment;
							return (
								<Route
									key={index}
									path={route.path}
									element={
										<ProtectedRoute>
											<LayoutComponent>
												<Page />
											</LayoutComponent>
										</ProtectedRoute>
									}
								/>
							);
						})}
					<Route path={routes.login} element={<Login />} />
					<Route path={routes.signup} element={<SignUp />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
