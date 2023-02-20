import classNames from 'classnames/bind';
import styles from './ModelVideo.module.scss';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { memo, useEffect, useRef, useState } from 'react';
import {
	Cast,
	Crew,
	Movie,
	MovieDetails,
	VideoModel,
	VideoState,
} from '../../interface';
import request from '../../utils/httpRequest';
import config from '../../config';
import Video from '../Video';
import images from '../../assets/images';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCheck,
	faChevronDown,
	faChevronUp,
	faPause,
	faPlay,
	faPlus,
	faRotate,
	faTimes,
	faVolumeDown,
	faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
import {
	addMovieFavourite,
	setDataModel,
	setDisplayModelFullScreen,
} from '../../redux/actions';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
interface ModelVideoProps {
	active?: boolean;
	fullscreen?: boolean;
	turnOffModel?: Function;
}

const ModelVideo = ({ active = false, turnOffModel }: ModelVideoProps) => {
	const [videoModel, setVideoModel] = useState<VideoState>({
		videoRelated: {},
		videoVolumeClicked: false,
		trailerCurrent: undefined,
		isVideoEnd: false,
		isVideoStart: false,
	});

	const [thugon, setThuGon] = useState<boolean>(true);

	const [similarMovie, setSimilarMovie] = useState<Movie[]>();

	const [movie, setMovie] = useState<MovieDetails>();

	const [cast, setCast] = useState<Cast[]>();
	const [crew, setCrew] = useState<Crew[]>();

	const dispatch = useDispatch();

	const idMovie = useSelector((state: RootState) => state.videoModel.idMovie);
	const fullscreen = useSelector(
		(state: RootState) => state.videoModel.fullscreen,
	);
	const myMovie = useSelector((state: RootState) => state.videoFavourite);

	useEffect(() => {
		let delayVideo: NodeJS.Timeout;
		if (idMovie) {
			const getMovieDetails = async () => {
				const res = await request(
					`https://api.themoviedb.org/3/movie/${idMovie}`,
					{
						params: {
							api_key: config.api_key,
						},
					},
				);

				return res;
			};
			getMovieDetails()
				.then(async (res) => {
					setMovie(res.data);
					const lstVideoRelated = await request(
						`https://api.themoviedb.org/3/movie/${idMovie}/videos`,
						{
							params: {
								api_key: config.api_key,
								language: 'en-US',
								append_to_response: 'videos',
							},
						},
					);

					const lstCast = await request(
						`https://api.themoviedb.org/3/movie/${idMovie}/credits`,
						{
							params: {
								api_key: config.api_key,
								language: 'en-US',
							},
						},
					);

					let lstCrew = lstCast.data.crew.filter(
						(item: Crew) =>
							item.known_for_department === 'Directing' ||
							item.known_for_department === 'Writing',
					);

					lstCrew = lstCrew.reduce((results: Crew[], item: Crew) => {
						const existCrew = results.some((crew) => crew.name === item.name);
						const existDirecting = results.some(
							(directing) => directing.known_for_department === 'Directing',
						);
						if (existCrew) return results;
						if (existDirecting && item.known_for_department === 'Directing')
							return results;
						return [
							...results,
							{
								gender: item.gender,
								id: item.id,
								known_for_department: item.known_for_department,
								name: item.name,
								profile_path: item.profile_path,
								department: item.department,
								job: item.job,
							},
						];
					}, []);

					const lstMovieSimilar = await request(
						`https://api.themoviedb.org/3/movie/${idMovie}/similar`,
						{
							params: {
								api_key: config.api_key,
								language: 'en-US',
							},
						},
					);

					setSimilarMovie(lstMovieSimilar.data.results);
					setCast([...lstCast.data.cast]);
					setCrew(lstCrew);
					delayVideo = setTimeout(() => {
						setVideoModel({
							...videoModel,
							videoRelated: lstVideoRelated.data,
							trailerCurrent: lstVideoRelated.data.results[0],
						});
					}, 1500);
				})
				.catch(console.error);
		}

		return () => {
			if (delayVideo) clearTimeout(delayVideo);
		};
	}, [idMovie]);

	const handleAddVideoFavourite = (movie?: Movie) => {
		if (movie) dispatch(addMovieFavourite(movie));
	};

	const youtubeRef = useRef<any>(null);

	const handleFullScreen = () => {
		if (turnOffModel) {
			turnOffModel();
		}
		dispatch(setDisplayModelFullScreen(!fullscreen));
	};

	const videoVolumeClicked = () => {
		if (videoModel.isVideoStart === false && videoModel.isVideoEnd === false) {
			setVideoModel((prev) => ({
				...prev,
				isVideoStart: true,
			}));
		}
		setVideoModel((prev) => ({
			...prev,
			videoVolumeClicked: !videoModel.videoVolumeClicked,
		}));
		videoModel.videoVolumeClicked
			? youtubeRef.current.mute()
			: youtubeRef.current.unMute();
	};

	const handleVideoEnd = () => {
		setVideoModel((prev) => ({
			...prev,
			isVideoEnd: true,
			isVideoStart: false,
		}));
	};

	const handleVideoStart = () => {
		setVideoModel((prev) => ({
			...prev,
			isVideoEnd: false,
			isVideoStart: true,
		}));

		setTimeout(() => {
			if (youtubeRef.current) {
				setVideoModel((prev) => ({
					...prev,
					videoVolumeClicked: !videoModel.videoVolumeClicked,
					isVideoStart: !videoModel.isVideoStart,
				}));
				videoModel.videoVolumeClicked
					? youtubeRef.current.mute()
					: youtubeRef.current.unMute();
			}
		}, 100);
	};

	const handlePlay = () => {
		if (videoModel.isVideoEnd) {
			setVideoModel((prev) => ({
				...prev,
				isVideoEnd: false,
				isVideoStart: true,
			}));

			setTimeout(() => {
				if (youtubeRef.current) {
					setVideoModel((prev) => ({
						...prev,
						videoVolumeClicked: !videoModel.videoVolumeClicked,
						isVideoStart: !videoModel.isVideoStart,
					}));
					videoModel.videoVolumeClicked
						? youtubeRef.current.mute()
						: youtubeRef.current.unMute();
				}
			}, 100);
		} else {
			if (youtubeRef.current) {
				setVideoModel((prev) => ({
					...prev,
					isVideoStart: !videoModel.isVideoStart,
				}));

				videoModel.isVideoStart
					? youtubeRef.current.pause()
					: youtubeRef.current.play();
			}
		}
	};

	const handleClickOverlay = () => {
		dispatch(setDisplayModelFullScreen(false));
	};

	const handleThuGonContent = () => {
		setThuGon(!thugon);
	};

	const handlePlayVideoSimilar = (movie: Movie) => {
		const payload: VideoModel = {
			idMovie: movie.id,
		};
		if (divRef.current) {
			divRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
		dispatch(setDataModel(payload));
		setVideoModel((prev) => ({
			...prev,
			videoVolumeClicked: !prev.videoVolumeClicked,
			isVideoEnd: false,
		}));

		setThuGon(true);
	};

	const divRef = useRef<any>(null);

	return (
		<div
			className={cx('model-slider', 'model-slider-item', {
				active,
				fullscreen,
			})}
			onClick={handleClickOverlay}
		>
			<div
				ref={divRef}
				className={cx('box')}
				onClick={(e) => e.stopPropagation()}
			>
				<div className={cx('box-video')}>
					<div className={cx({ 'overlay-video': fullscreen })}>
						<h2 className={cx('title')}>
							{movie && (movie.title ? movie.title : movie.name)}
						</h2>
						{movie &&
							(videoModel.trailerCurrent && !videoModel.isVideoEnd ? (
								<>
									<Video
										onMute={videoVolumeClicked}
										ref={youtubeRef}
										videoCurrent={videoModel.trailerCurrent}
										handleVideoEnd={handleVideoEnd}
									/>
								</>
							) : (
								<div className={cx('img')}>
									<picture>
										<img
											src={
												movie!.backdrop_path != null
													? config.path_image + movie!.backdrop_path
													: images.no_image
											}
											alt={movie!.name ? movie!.name : movie!.title}
										/>
									</picture>
								</div>
							))}
						{fullscreen && (
							<div className={cx('close_model')}>
								<Button
									hasIcon
									iconSmall
									rounded
									btnClose
									onClick={handleClickOverlay}
									icon={<FontAwesomeIcon icon={faTimes} />}
								/>
							</div>
						)}

						<div className={cx('button_controls')}>
							{fullscreen && (
								<>
									<div className={cx('controls_item')}>
										<Button
											text={!videoModel.isVideoStart ? 'Phát' : 'Tạm dừng'}
											primary
											hasIconLabel
											iconMedium
											btnSmall
											onClick={handlePlay}
											icon={
												<FontAwesomeIcon
													icon={!videoModel.isVideoStart ? faPlay : faPause}
												/>
											}
										/>
									</div>
									<div className={cx('controls_item')}>
										<Button
											hasIcon
											iconSmall
											rounded
											btnModel
											onClick={() => handleAddVideoFavourite(movie)}
											icon={
												<FontAwesomeIcon
													icon={
														movie !== undefined &&
														myMovie.find((item) => item.id === movie!.id)
															? faCheck
															: faPlus
													}
												/>
											}
										/>
									</div>
								</>
							)}

							<div className={cx('mute-btn', 'controls_item')}>
								{videoModel.isVideoEnd ? (
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
										hasIcon
										iconSmall
										rounded
										btnModel
										onClick={videoVolumeClicked}
										icon={
											<FontAwesomeIcon
												icon={
													videoModel.videoVolumeClicked
														? faVolumeDown
														: faVolumeMute
												}
											/>
										}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className={cx('content')}>
					{!fullscreen && (
						<div className={cx('button_controls')}>
							<div className={cx('controls_item')}>
								<Button
									hasIcon
									iconSmall
									rounded
									btnPlay
									onClick={handleFullScreen}
									icon={<FontAwesomeIcon icon={faPlay} />}
								/>
							</div>
							<div className={cx('controls_item')}>
								<Button
									hasIcon
									iconSmall
									rounded
									btnModel
									onClick={() => handleAddVideoFavourite(movie)}
									icon={
										<FontAwesomeIcon
											icon={
												movie !== undefined &&
												myMovie.find((item) => item.id === movie!.id)
													? faCheck
													: faPlus
											}
										/>
									}
								/>
							</div>
							<div className={cx('controls_item')}>
								<Button
									hasIcon
									iconSmall
									rounded
									btnModel
									onClick={handleFullScreen}
									icon={<FontAwesomeIcon icon={faChevronDown} />}
								/>
							</div>
						</div>
					)}
					<div className={cx('grid_info')}>
						<div className={cx('grid_info_left')}>
							<div className={cx('info')}>
								<span className={cx('vote_avg', 'info_top')}>
									Đánh giá: {movie?.vote_average.toFixed(1)}
								</span>
								{fullscreen && (
									<span className={cx('year', 'info_top')}>
										{movie ? movie.release_date.substring(0, 4) : ''}
									</span>
								)}

								<span className={cx('duration', 'info_top')}>
									{movie
										? `${Math.floor(movie.runtime / 60)}h ${
												movie.runtime % 60 > 0 ? (movie.runtime % 60) + 'p' : ''
										  } `
										: ''}
								</span>
							</div>
							{fullscreen && (
								<div className={cx('excerpt')}>{movie?.overview ?? ''}</div>
							)}
						</div>
						<div className={cx('grid_info_right')}>
							{fullscreen && (
								<div className={cx('cast')}>
									<span className={cx('info_label')}>{`Diễn viên: `}</span>
									{cast &&
										cast.map((castItem, index) => {
											if (index > 4) return false;
											if (index <= 3) {
												return (
													<span
														className={cx('cast_item', {
															last_genres_item: index === cast.length - 1,
														})}
														key={castItem.id}
													>
														<Link to="#">
															{`${castItem.name}`}
															{index === cast.length - 1 ? '' : ','}&nbsp;
														</Link>
													</span>
												);
											}

											return (
												<span
													className={cx('cast_item', 'last_item')}
													key={castItem.id}
												>
													<Link to="#">thêm</Link>
												</span>
											);
										})}
								</div>
							)}

							<div className={cx('genres')}>
								{fullscreen && (
									<span className={cx('info_label')}>{`Thể loại: `}</span>
								)}
								{movie &&
									movie.genres.map((genre, index) => {
										if (index > 2) return false;
										if (!fullscreen) {
											return (
												<div className={cx('genres_item')} key={genre.id}>
													<span>{genre.name}</span>
												</div>
											);
										}

										return (
											<span className={cx('genres_item')} key={genre.id}>
												<Link to="#">
													{`${genre.name}`}
													{index === movie.genres.length - 1 ? '' : ','}&nbsp;
												</Link>
											</span>
										);
									})}
							</div>
						</div>
					</div>
					{fullscreen && (
						<>
							{similarMovie?.length !== 0 && (
								<div className="similar_wrapper">
									<div className={cx('model_header')}>
										<h3>Nội dung tương tự</h3>
									</div>
									<div
										className={cx('similar_container', {
											thugon,
										})}
									>
										{similarMovie &&
											similarMovie.map((movie: Movie, index) => {
												let banner = config.path_image + movie.backdrop_path;
												if (movie.backdrop_path === null) {
													banner = images.no_image;
												}
												const isMovieFavourite = myMovie.find(
													(item) => item.id === movie.id,
												);

												return (
													<div
														className={cx('similar_item')}
														key={movie.id + index}
													>
														<div className={cx('img')}>
															<picture>
																<img
																	src={banner}
																	alt={movie.name ?? movie.title}
																/>
															</picture>
															<div className={cx('play_video')}>
																<Button
																	hasIcon
																	iconMedium
																	rounded
																	btnModel
																	onClick={() => handlePlayVideoSimilar(movie)}
																	icon={<FontAwesomeIcon icon={faPlay} />}
																/>
															</div>
														</div>
														<div className={cx('info')}>
															<div className={cx('info_top')}>
																<div className={cx('info_content')}>
																	<p className={cx('vote_avg')}>
																		Đánh giá: {movie?.vote_average.toFixed(1)}
																	</p>
																	<p className={cx('year')}>
																		{movie
																			? movie.release_date.substring(0, 4)
																			: ''}
																	</p>
																</div>
																<div className={cx('info_control')}>
																	<Button
																		hasIcon
																		iconSmall
																		rounded
																		btnModel
																		onClick={() =>
																			handleAddVideoFavourite(movie)
																		}
																		icon={
																			<FontAwesomeIcon
																				icon={
																					isMovieFavourite ? faCheck : faPlus
																				}
																			/>
																		}
																	/>
																</div>
															</div>
															<div className={cx('overview')}>
																{movie.overview}
															</div>
														</div>
													</div>
												);
											})}
									</div>
									<div
										className={cx('divider', {
											collapsed: thugon,
										})}
									>
										<Button
											secondary
											hasIcon
											iconSmall
											rounded
											onClick={handleThuGonContent}
											icon={
												<FontAwesomeIcon
													icon={thugon ? faChevronDown : faChevronUp}
												/>
											}
										/>
									</div>
								</div>
							)}
							<div className={cx('about_wrapper')}>
								<div className={cx('model_header')}>
									<h3>
										Giới thiệu về{' '}
										<strong>
											{movie?.original_name ?? movie?.original_title}
										</strong>
									</h3>
								</div>
								<div className={cx('about_container')}>
									<div className={cx('about_container_item')}>
										<span className={cx('info_label')}>{`Đạo diễn: `}</span>
										<span>
											<Link to="#">
												{
													crew?.find(
														(item: Crew) =>
															item.known_for_department === 'Directing',
													)?.name
												}
											</Link>
										</span>
									</div>
									<div className={cx('about_container_item')}>
										<span className={cx('info_label')}>{`Diễn viên: `}</span>
										{cast &&
											cast.map((castItem, index) => {
												return (
													<span key={castItem.name + index}>
														<Link to="#">
															{`${castItem.name}`}
															{index === cast.length - 1 ? '' : ','}&nbsp;
														</Link>
													</span>
												);
											})}
									</div>
									<div className={cx('about_container_item')}>
										<span className={cx('info_label')}>{`Biên kịch: `}</span>
										{crew &&
											crew.map((crewItem, index) => {
												if (crewItem.known_for_department === 'Directing')
													return false;
												return (
													<span key={crewItem.name}>
														<Link to="#">
															{`${crewItem.name}`}
															{index === crew.length - 1 ? '' : ','}&nbsp;
														</Link>
													</span>
												);
											})}
									</div>
									<div className={cx('about_container_item')}>
										<span className={cx('info_label')}>{`Thể loại: `}</span>
										{movie &&
											movie.genres.map((genre, index) => {
												return (
													<span key={genre.name}>
														<Link to="#">
															{`${genre.name}`}
															{index === movie.genres.length - 1 ? '' : ','}
															&nbsp;
														</Link>
													</span>
												);
											})}
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(ModelVideo);
