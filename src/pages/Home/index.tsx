import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { lazy, memo, Suspense } from 'react';
import SliderLazy from '../../components/Slider/SliderLazy';

const Home = () => {
	let genres = useSelector((state: RootState) => state.genres);
	genres = genres.slice(0, genres.length / 2);
	const Billboard = lazy(() => import('../../components/Billboard'));
	const Slider = lazy(() => import('../../components/Slider'));
	return (
		<div className="main_container">
			<Suspense
				fallback={
					<div className="container_loading">
						<SliderLazy />
						<SliderLazy />
					</div>
				}
			>
				<Billboard />
				<div className="box_slider">
					<Suspense
						fallback={
							<>
								<SliderLazy />
							</>
						}
					>
						{genres &&
							genres.map((genre) => (
								<Slider key={genre.id} name={genre.name} genres_id={genre.id} />
							))}
					</Suspense>
				</div>
			</Suspense>
		</div>
	);
};

export default memo(Home);
