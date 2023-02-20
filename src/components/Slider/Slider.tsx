import className from 'classnames/bind';
import styles from './Slider.module.scss';
import { useEffect, useState, memo } from 'react';
import { Movie, SliderProps, stateSlider } from '../../interface';
import request from '../../utils/httpRequest';
import config from '../../config';
import SliderItem from './SliderItem';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import images from '../../assets/images';
import SliderLazy from './SliderLazy';

const cx = className.bind(styles);

const Slider = ({ name = '', genres_id }: SliderProps) => {
	const [data, setData] = useState<stateSlider>(() => {
		let showSlider = 6;
		let lstNext = [
			[0, 12],
			[0, 18],
			[6, 20],
			[12, 6],
		];

		let lstPrev = [
			[14, 12],
			[8, 6],
			[2, 20],
			[16, 14],
		];
		const windowWidth = window.innerWidth;
		if (windowWidth >= 1100 && windowWidth <= 1399) {
			showSlider = 5;
		} else if (windowWidth >= 800 && windowWidth <= 1099) {
			showSlider = 4;
		} else if (windowWidth >= 500 && windowWidth <= 799) {
			showSlider = 3;
			lstNext = [
				[0, 6],
				[0, 9],
				[3, 12],
				[6, 15],
				[9, 18],
				[12, 1],
				[15, 4],
			];

			lstPrev = [
				[17, 6],
				[14, 3],
				[11, 20],
				[8, 17],
				[5, 14],
				[2, 11],
				[19, 8],
			];
		} else if (windowWidth <= 499) {
			showSlider = 2;
		}

		if ((windowWidth <= 1399 && windowWidth > 799) || windowWidth <= 499) {
			lstNext = [[0, showSlider * 2]];
			lstPrev = [[20 - showSlider, showSlider * 2]];
			let startNext = -showSlider;
			let endNext = showSlider * 2;

			let startPrev = 20 - showSlider;
			let endPrev = showSlider * 2;

			// lstNext
			for (let i = 0; i < 20; i++) {
				startNext += showSlider;
				endNext += showSlider;
				if (endNext > 20) {
					endNext = endNext - 20;
					lstNext = [...lstNext, [startNext, endNext]];

					break;
				} else {
					lstNext = [...lstNext, [startNext, endNext]];
				}
			}

			// lstPrev
			for (let i = 0; i < 20; i++) {
				startPrev -= showSlider;
				endPrev -= showSlider;
				if (startPrev === 0) {
					lstPrev = [...lstPrev, [startPrev, endPrev]];
					break;
				}
				if (startPrev < 0) {
					startPrev = 20 - startPrev * -1;
					lstPrev = [...lstPrev, [startPrev, endPrev]];
					break;
				}
				if (endPrev === 0) endPrev = 20;

				lstPrev = [...lstPrev, [startPrev, endPrev]];
			}
		}

		return {
			lstMovie: [],
			lstMovieActive: [],
			lstPrev: lstPrev,
			lstNext: lstNext,
			show: showSlider,
			offsetCurrent: {
				next: 0,
				prev: 0,
			},
			offsetActive: {
				start: 0,
				end: showSlider - 1,
			},
			showPrev: false,
			styles: '',
			length: 0,
		};
	});

	useEffect(() => {
		const getListMovie = async () => {
			const res = await request(`3/discover/movie`, {
				params: {
					api_key: config.api_key,
					with_genres: genres_id,
				},
			});

			return res.data.results;
		};

		getListMovie()
			.then((res) => {
				let newData = res;
				const show = data.show;
				const length = newData.length;
				const lstMovieActive = newData.slice(0, show * 2);

				setData({
					...data,
					lstMovie: newData,
					lstMovieActive: lstMovieActive,
					length: length,
				});
			})
			.catch(console.error);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleClick = (type: string) => {
		let translateX: number = (-100 / data.show) * data.show;
		let styles: string = `translate3d(${translateX}%, 0px, 0px)`;

		let offset = 0;
		let nextOffset = data.offsetCurrent.next;
		let prevOffset = data.offsetCurrent.prev;
		let lstData = data.lstNext;

		let countItemMissed = data.length - data.show * 3;
		let lstMovieBonus: Movie[] = [];
		let offsetCurrent = {
			next: nextOffset,
			prev: prevOffset,
		};

		let offsetActive = {
			start: data.show,
			end: data.show * 2 - 1,
		};

		let lstMovieActive: Movie[] = [];

		if (type === 'prev') {
			lstData = data.lstPrev;
			translateX = (100 / data.show) * data.show;
			styles = `translate3d(${-translateX}%, 0px, 0px)`;

			offset = prevOffset + 1;
			offsetCurrent.prev = offset;

			if (nextOffset > 1) {
				offset = nextOffset - 1;
				lstData = data.lstNext;
				offsetCurrent.next = offset;
				offsetCurrent.prev = 0;
			}

			if (nextOffset === 1) {
				offset = 0;
				offsetCurrent.next = 0;
				offsetCurrent.prev = offset;
			}

			if (nextOffset === -1) {
				offset = 2;
				offsetCurrent.next = 0;
				offsetCurrent.prev = offset;
			}

			if (lstData.length - 1 === offset) {
				offsetActive = {
					start: countItemMissed - 1,
					end: countItemMissed + data.show,
				};
			}

			if (offset === lstData.length) {
				offset = 0;
				offsetCurrent.prev = offset;
			}

			let startOffset = lstData[offset][0];
			let endOffset = lstData[offset][1];

			if (startOffset > endOffset) {
				lstMovieBonus = data.lstMovie.slice(startOffset, data.length);
				lstMovieActive = data.lstMovie.slice(0, endOffset);

				lstMovieActive = [...lstMovieBonus, ...lstMovieActive];
			} else {
				lstMovieActive = data.lstMovie.slice(startOffset, endOffset);
			}
		}

		if (type === 'next') {
			offset = nextOffset + 1;
			if (offsetCurrent.next === -1 || offsetCurrent.prev === 1) {
				lstData = data.lstPrev;
				offset = 0;
				offsetCurrent.next = offset;
				offsetCurrent.prev = offset;
			}

			offsetCurrent.next = offset;

			if (prevOffset > 1) {
				lstData = data.lstPrev;
				offset = prevOffset - 1;
				offsetCurrent.prev = offset;
				offsetCurrent.next = 0;
			}

			if (lstData.length - 1 === offset) {
				lstData = data.lstPrev;
				offset = prevOffset + 1;
				offsetCurrent.next = -1;
			}

			let startOffset = lstData[offset][0];
			let endOffset = lstData[offset][1];

			if (startOffset > endOffset) {
				lstMovieBonus = data.lstMovie.slice(startOffset, data.length);
				lstMovieActive = data.lstMovie.slice(0, endOffset);

				lstMovieActive = [...lstMovieBonus, ...lstMovieActive];
			} else {
				lstMovieActive = data.lstMovie.slice(startOffset, endOffset);
			}
		}

		setData({
			...data,
			showPrev: true,
			offsetActive,
			offsetCurrent,
			lstMovieActive,
			styles,
		});
	};

	return (
		<>
			{data.lstMovieActive.length > 0 ? (
				<div className={cx('container')}>
					<div className={cx('wrapper_title')}>
						<h2 className={cx('header_title', 'header_title_effect')}>
							<Link to={`/genre/${genres_id}`} className={cx('title_link')}>
								<span className={cx('title')}>{name}</span>
								<div className={cx('arrow_view_more')}>
									<span className={cx('view_more_title')}>Xem tất cả</span>
									<FontAwesomeIcon
										className={cx('view_more_icon')}
										icon={faChevronRight}
									/>
								</div>
							</Link>
						</h2>
						<ul className={cx('pagination_wrapper')}>
							{data.lstNext.map((item, index) => {
								let isActive = 0;

								if (data.offsetCurrent.next > 0) {
									isActive = data.offsetCurrent.next;
								}

								if (data.offsetCurrent.prev > 0) {
									isActive = data.lstNext.length - data.offsetCurrent.prev;
								}

								if (
									data.offsetCurrent.next === -1 ||
									(data.offsetCurrent.prev === 1 &&
										data.offsetCurrent.next === 0)
								) {
									isActive = data.lstNext.length - 1;
								}

								return (
									<li
										key={index}
										className={cx({
											active: index === isActive,
										})}
									></li>
								);
							})}
						</ul>
					</div>

					<div className={cx('wrapper_slider')}>
						{data.showPrev && (
							<div
								onClick={() => handleClick('prev')}
								className={cx('arrow', 'prev')}
							>
								<FontAwesomeIcon icon={faChevronLeft} />
							</div>
						)}

						<div className={cx('slider_inner')}>
							<div
								className={cx('slider')}
								style={{
									transform: `${data.styles}`,
								}}
							>
								{data.lstMovieActive.map((movie, index) => {
									let banner = config.path_image + movie.backdrop_path;
									if (movie.backdrop_path === null) {
										banner = images.no_image;
									}

									let isActive = false;
									if (
										index >= data.offsetActive.start &&
										index <= data.offsetActive.end
									) {
										isActive = true;
									}

									return (
										<SliderItem
											active={isActive}
											key={movie.id}
											banner={banner}
											movie={movie}
										/>
									);
								})}
							</div>
						</div>
						<div
							onClick={() => handleClick('next')}
							className={cx('arrow', 'next')}
						>
							<FontAwesomeIcon icon={faChevronRight} />
						</div>
					</div>
				</div>
			) : (
				<SliderLazy />
			)}
		</>
	);
};

export default memo(Slider);
