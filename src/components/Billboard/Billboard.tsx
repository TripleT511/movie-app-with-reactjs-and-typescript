import Button from '../Button';
import config from '../../config';
import images from '../../assets/images';
import styles from './Billboard.module.scss';
import request from '../../utils/httpRequest';
import { BillBoardState, VideoModel, VideoState } from '../../interface';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState, memo } from 'react';
import {
	faPlay,
	faInfoCircle,
	faVolumeDown,
	faVolumeMute,
	faRotate,
	faPause,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Video from '../Video';
import { useDispatch } from 'react-redux';
import { setDataModel, setTopPositionModel } from '../../redux/actions';

const cx = classNames.bind(styles);

const Billboard = () => {
	const [info, setInfo] = useState<BillBoardState>({
		id: 0,
		src: '',
		title: '',
		name: '',
		overview: '',
	});

	const [videoCurrent, setVideoCurrent] = useState<VideoState>({
		videoRelated: {},
		videoVolumeClicked: false,
		trailerCurrent: undefined,
		isVideoEnd: false,
		isVideoStart: false,
	});

	const dispatch = useDispatch();

	const youtubeRef = useRef<any>(null);
	const billboardRef = useRef<any>(null);
	const isPauseVideoRef = useRef<any>(null);

	useEffect(() => {
		let delayVideo: NodeJS.Timeout;
		let offset = billboardRef.current.offsetWidth * (9 / 16);
		isPauseVideoRef.current = 0;

		const getMovieRated = async () => {
			const res = await request('3/trending/all/day', {
				params: {
					api_key: config.api_key,
				},
			});

			return res;
		};

		const handleScrollWindow = () => {
			let windowY = parseFloat(window.scrollY.toFixed(2));

			if (windowY > offset * 0.5 && youtubeRef.current) {
				if (isPauseVideoRef.current === 0) {
					setVideoCurrent((prev) => ({
						...prev,
						trailerCurrent: undefined,
						isVideoEnd: false,
						isVideoStart: false,
					}));
				}
			}
			// else {
			// 	if (isPauseVideoRef.current === 1) {
			// 		isPauseVideoRef.current = 0;
			// 		youtubeRef.current.play();
			// 	}
			// }
		};

		getMovieRated()
			.then(async (res) => {
				const trendingMovie = res.data.results[0];
				const srcImage =
					trendingMovie.backdrop_path != null
						? config.path_image + trendingMovie.backdrop_path
						: images.no_image;
				setInfo({
					...info,
					id: trendingMovie.id,
					src: srcImage,
					title: trendingMovie.title,
					name: trendingMovie.name,
					overview: trendingMovie.overview,
				});

				const response = await request(
					`https://api.themoviedb.org/3/movie/${trendingMovie.id}/videos`,
					{
						params: {
							api_key: config.api_key,
							language: 'en-US',
							append_to_response: 'videos',
						},
					},
				);

				return response;
			})
			.then((res) => {
				delayVideo = setTimeout(() => {
					setVideoCurrent({
						...videoCurrent,
						videoRelated: res.data,
						trailerCurrent: res.data.results[0],
					});

					window.addEventListener('scroll', handleScrollWindow);
				}, 3000);
			})
			.catch(console.error);

		return () => {
			if (delayVideo) clearTimeout(delayVideo);
			window.removeEventListener('scroll', handleScrollWindow);
		};
	}, []);

	const videoVolumeClicked = () => {
		if (youtubeRef.current) {
			setVideoCurrent((prev) => ({
				...prev,
				isVideoStart: true,
				videoVolumeClicked: !videoCurrent.videoVolumeClicked,
			}));

			videoCurrent.videoVolumeClicked
				? youtubeRef.current.mute()
				: youtubeRef.current.unMute();
		}
	};

	const handleVideoEnd = () => {
		setVideoCurrent((prev) => ({
			...prev,
			isVideoEnd: true,
			isVideoStart: false,
		}));
	};

	const handleVideoStart = () => {
		if (videoCurrent.isVideoStart) return false;
		if (
			!videoCurrent.trailerCurrent &&
			videoCurrent.videoRelated.results?.length !== 0
		) {
			setVideoCurrent((prev) => ({
				...prev,
				videoVolumeClicked: !videoCurrent.videoVolumeClicked,
				trailerCurrent: videoCurrent.videoRelated!.results![0],
				isVideoEnd: false,
			}));

			videoCurrent.videoVolumeClicked
				? youtubeRef.current.mute()
				: youtubeRef.current.unMute();
		} else {
			setVideoCurrent((prev) => ({
				...prev,
				isVideoEnd: false,
			}));
		}
	};

	const handlePlay = () => {
		if (
			!videoCurrent.trailerCurrent &&
			videoCurrent.videoRelated.results?.length !== 0
		) {
			setVideoCurrent((prev) => ({
				...prev,
				videoVolumeClicked: !videoCurrent.videoVolumeClicked,
				trailerCurrent: videoCurrent.videoRelated!.results![0],
				isVideoEnd: false,
			}));

			videoCurrent.videoVolumeClicked
				? youtubeRef.current.mute()
				: youtubeRef.current.unMute();

			return false;
		}
		if (videoCurrent.isVideoEnd) {
			setVideoCurrent((prev) => ({
				...prev,
				isVideoEnd: false,
				isVideoStart: true,
			}));
			setTimeout(() => {
				if (youtubeRef.current) {
					setVideoCurrent((prev) => ({
						...prev,
						videoVolumeClicked: !videoCurrent.videoVolumeClicked,
						isVideoStart: !videoCurrent.isVideoStart,
					}));
					videoCurrent.videoVolumeClicked
						? youtubeRef.current.mute()
						: youtubeRef.current.unMute();
				}
			}, 100);
		} else {
			if (youtubeRef.current) {
				setVideoCurrent((prev) => ({
					...prev,
					isVideoStart: !videoCurrent.isVideoStart,
				}));

				videoCurrent.isVideoStart
					? youtubeRef.current.pause()
					: youtubeRef.current.play();
			}
		}
	};

	const handleShowModel = () => {
		if (youtubeRef.current) {
			youtubeRef.current.pause();
		}

		setVideoCurrent((prev) => ({
			...prev,
			trailerCurrent: undefined,
			isVideoStart: false,
			isVideoEnd: true,
		}));

		const payload: VideoModel = {
			idMovie: info.id,
			fullscreen: true,
		};

		dispatch(setDataModel(payload));

		dispatch(setTopPositionModel(window.scrollY + 'px'));
	};

	return (
		<div className={cx('billboard_wrapper')} ref={billboardRef}>
			{videoCurrent.trailerCurrent && !videoCurrent.isVideoEnd ? (
				<div className="overlay-video">
					<Video
						onMute={videoVolumeClicked}
						ref={youtubeRef}
						videoCurrent={videoCurrent.trailerCurrent}
						handleVideoEnd={handleVideoEnd}
					/>
				</div>
			) : (
				<div className={cx('img')}>
					<picture>
						<img src={info.src} alt={info.name ?? info.title} />
					</picture>
				</div>
			)}

			<div className={cx('info')}>
				<h3 className={cx('title')}>{info.name ?? info.title}</h3>

				<p
					className={cx('overview', {
						active: videoCurrent.isVideoStart,
					})}
				>
					{info.overview}
				</p>
				<div className={cx('wrapper-button')}>
					<Button
						text={!videoCurrent.isVideoStart ? 'Phát' : 'Tạm dừng'}
						primary
						hasIconLabel
						iconMedium
						onClick={handlePlay}
						icon={
							<FontAwesomeIcon
								icon={!videoCurrent.isVideoStart ? faPlay : faPause}
							/>
						}
					/>
					<Button
						text="Thông tin khác"
						secondary
						hasIconLabel
						iconMedium
						onClick={handleShowModel}
						icon={<FontAwesomeIcon icon={faInfoCircle} />}
					/>
				</div>
			</div>
			<div className={cx('options-video')}>
				{videoCurrent.isVideoEnd ? (
					<Button
						secondary
						hasIcon
						iconSmall
						rounded
						onClick={handleVideoStart}
						icon={<FontAwesomeIcon icon={faRotate} />}
					/>
				) : (
					<Button
						secondary
						hasIcon
						iconSmall
						rounded
						onClick={videoVolumeClicked}
						icon={
							<FontAwesomeIcon
								icon={
									videoCurrent.videoVolumeClicked ? faVolumeDown : faVolumeMute
								}
							/>
						}
					/>
				)}
			</div>
		</div>
	);
};

export default memo(Billboard);
