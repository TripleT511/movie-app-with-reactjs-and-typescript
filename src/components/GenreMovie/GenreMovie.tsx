import classNames from 'classnames/bind';
import { MovieDetails } from '../../interface';
import styles from './GenreMovie.module.scss';
import { useState, useEffect, useRef } from 'react';
import request from '../../utils/httpRequest';
import config from '../../config';
import { useParams } from 'react-router-dom';
import SliderItem from '../Slider/SliderItem';
import images from '../../assets/images';

const cx = classNames.bind(styles);

interface GenreMovieState {
	results: MovieDetails[];
	page: number;
	totalPages: number;
}

const GenreMovie = () => {
	const [dataMovie, setDataMovie] = useState<GenreMovieState>({
		results: [],
		page: 1,
		totalPages: 0,
	});
	const [loading, setLoading] = useState<boolean>(false);

	const params = useParams();

	useEffect(() => {
		if (dataMovie.totalPages !== 0 && dataMovie.page > dataMovie.totalPages) {
			return;
		}
		const getListMovie = async () => {
			const res = await request(`3/discover/movie`, {
				params: {
					api_key: config.api_key,
					with_genres: params.genreId,
					page: dataMovie.page,
				},
			});

			return res;
		};

		getListMovie()
			.then((res) => {
				const data = res.data;
				setDataMovie((prev) => ({
					results: [...prev.results, ...data.results],
					page: data.page,
					totalPages: data.total_pages,
				}));
			})
			.catch(console.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataMovie.page]);

	useEffect(() => {
		let observer: IntersectionObserver;
		if (loadingRef.current) {
			observer = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					setLoading(true);
				}
			});

			observer.observe(loadingRef?.current);
		}

		return () => {
			if (loadingRef.current) {
				// eslint-disable-next-line react-hooks/exhaustive-deps
				observer.unobserve(loadingRef?.current);
			}
		};
	}, []);

	// Get More Data
	useEffect(() => {
		let timeOutLoading: NodeJS.Timeout;
		timeOutLoading = setTimeout(() => {
			if (loading) {
				setDataMovie((prev) => ({
					...prev,
					page: prev.page + 1,
				}));
				setLoading(false);
			}
		}, 1000);

		return () => {
			clearTimeout(timeOutLoading);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loading]);

	const loadingRef = useRef<any>(null);

	return (
		<div className={cx('genre_movie_wrapper')}>
			<div className={cx('sub_header')}>
				<div className={cx('title')}>Danh sách phim liên quan</div>
			</div>
			{dataMovie.results ? (
				<>
					<div className={cx('gallery_movie')}>
						{dataMovie.results.map((movie: MovieDetails, index: number) => {
							let banner = config.path_image + movie.backdrop_path;
							if (movie.backdrop_path === null) {
								banner = images.no_image;
							}

							return (
								<SliderItem key={movie.id} banner={banner} movie={movie} />
							);
						})}
					</div>
					<div
						className={cx('loading', {
							active: loading,
						})}
						ref={loadingRef}
					>
						<div className={cx('loader')}></div>
					</div>
				</>
			) : (
				<div className={cx('noResultsWrapper')}>
					<div className={cx('noResults')}>
						<p>Không có kết quả nào khớp với yêu cầu của bạn.</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default GenreMovie;
