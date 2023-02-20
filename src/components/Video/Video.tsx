import classNames from 'classnames/bind';
import YouTube, { YouTubeEvent } from 'react-youtube';
import styles from './Video.module.scss';
import { useRef, forwardRef, useImperativeHandle, memo } from 'react';
import { Videos } from '../../interface';
const cx = classNames.bind(styles);

interface VideoProps {
	videoCurrent: Videos;
	onMute: Function;
	handleVideoEnd: Function;
}

const Video = memo(
	forwardRef<any, VideoProps>(
		({ videoCurrent, onMute, handleVideoEnd }: VideoProps, ref) => {
			const opts = {
				width: '1519',
				height: '854',
				playerVars: {
					controls: 0,
					modestbranding: 1,
					rel: 0,
					showinfo: 0,
				},
			};

			const videoRef = useRef<any>(null);

			useImperativeHandle(ref, () => ({
				play() {
					videoRef.current.internalPlayer.playVideo();
				},
				pause() {
					videoRef.current.internalPlayer.pauseVideo();
				},
				mute() {
					videoRef.current.internalPlayer.mute();
				},
				unMute() {
					videoRef.current.internalPlayer.unMute();
				},
			}));

			const isReady = (e: YouTubeEvent<any>) => {
				if (videoRef.current) {
					videoRef.current.internalPlayer.playVideo();
					onMute();
				}
			};

			const onEnd = () => {
				handleVideoEnd();
			};

			return (
				<div className={cx('video-item')}>
					<div className={cx('box')}>
						<div className={cx('video')}>
							<YouTube
								key={videoCurrent.key}
								ref={videoRef}
								onReady={(e) => isReady(e)}
								onEnd={onEnd}
								videoId={videoCurrent.key}
								opts={opts}
							/>
						</div>
					</div>
				</div>
			);
		},
	),
);

export default Video;
