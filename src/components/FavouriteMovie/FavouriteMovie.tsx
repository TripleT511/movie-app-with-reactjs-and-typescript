import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import images from '../../assets/images';
import config from '../../config';
import { MovieDetails } from '../../interface';
import { RootState } from '../../redux/store';
import SliderItem from '../Slider/SliderItem';
import styles from './FavouriteMovie.module.scss';

const cx = classNames.bind(styles);

const FavouriteMovie = () => {
	const lstMovie = useSelector((state: RootState) => state.videoFavourite);

	return (
		<div className={cx('list_movie_wrapper')}>
			<div className={cx('sub_header')}>
				<div className={cx('title')}>Danh sách của tôi</div>
			</div>
			<div className={cx('gallery_movie')}>
				{lstMovie &&
					lstMovie.map((movie: MovieDetails, index: number) => {
						let banner = config.path_image + movie.backdrop_path;
						if (movie.backdrop_path === null) {
							banner = images.no_image;
						}

						return <SliderItem key={movie.id} banner={banner} movie={movie} />;
					})}
			</div>
		</div>
	);
};

export default FavouriteMovie;
