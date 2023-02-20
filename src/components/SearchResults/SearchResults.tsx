import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import images from '../../assets/images';
import config from '../../config';
import { useDebounce } from '../../hooks';
import { MovieDetails } from '../../interface';
import { getMoreSearchData } from '../../redux/actions';
import { RootState } from '../../redux/store';
import SliderItem from '../Slider/SliderItem';
import styles from './SearchResults.module.scss';

const cx = classNames.bind(styles);
const SearchResults = () => {
	const { keyword, results, page } = useSelector(
		(state: RootState) => state.searchMovie,
	);

	const [loading, setLoading] = useState<boolean>(false);

	const dispatch = useDispatch();

	const debounce = useDebounce({
		value: loading,
		delay: 100,
	});

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
		if (loading) {
			dispatch(getMoreSearchData(page + 1));
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounce]);

	const loadingRef = useRef<any>(null);

	return (
		<div className={cx('search_wrapper')}>
			<div className={cx('search_title_header')}>
				{results.length !== 0 && (
					<>
						<span className={cx('title')}>
							{' '}
							Khám phá phim và chương trình liên quan đến:
						</span>
						<span className={cx('keyword')}> {keyword}</span>
					</>
				)}
			</div>
			{results ? (
				<>
					<div className={cx('gallery_movie')}>
						{results.map((movie: MovieDetails, index: number) => {
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
						<p>
							Không có kết quả nào khớp với yêu cầu tìm kiếm "{keyword}" của
							bạn.
						</p>
						<p>Đề xuất:</p>
						<ul>
							<li>Thử nhập từ khóa khác</li>
							<li>Bạn đang tìm phim hoặc chương trình truyền hình?</li>
							<li>
								Thử sử dụng tên phim, chương trình truyền hình, tên diễn viên
								hoặc đạo diễn
							</li>
							<li>
								Thử một thể loại, như hài, lãng mạn, thể thao hoặc phim chính
								kịch
							</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
};

export default SearchResults;
