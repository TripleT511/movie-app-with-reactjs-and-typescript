import classNames from 'classnames/bind';
import styles from './Slider.module.scss';
import { SliderItemProps, VideoModel } from '../../interface';
import { useRef, useState, memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setDataModel } from '../../redux/actions';
import ModelVideo from '../ModelVideo';
const cx = classNames.bind(styles);

interface SliderItemState {
	display: number;
}
const SliderItem = ({ banner, active = false, movie }: SliderItemProps) => {
	const [model, setModel] = useState<SliderItemState>({
		display: 0,
	});

	const dispatch = useDispatch();
	const sliderItemRef = useRef<any>();
	let timeOutRef = useRef<any>();

	const handleEnter = useCallback(() => {
		const payload: VideoModel = {
			idMovie: movie.id,
		};

		if (timeOutRef.current) {
			clearTimeout(timeOutRef.current);
		}

		setModel({
			...model,
			display: 1,
		});

		dispatch(setDataModel(payload));
		timeOutRef.current = setTimeout(() => {
			setModel({
				...model,
				display: 2,
			});
		}, 350);
	}, []);

	const handleLeave = useCallback(() => {
		if (timeOutRef.current) {
			clearTimeout(timeOutRef.current);
		}

		setModel({
			...model,
			display: 0,
		});
	}, []);

	return (
		<div
			className={cx('slider-item', {
				active: active,
			})}
			onMouseEnter={() => handleEnter()}
			ref={sliderItemRef}
		>
			<div className={cx('img')}>
				<picture>
					<img src={banner} alt="" />
				</picture>
			</div>
			<div onMouseLeave={() => handleLeave()}>
				{model.display > 0 && (
					<ModelVideo
						turnOffModel={handleLeave}
						active={model.display === 2 ? true : false}
					/>
				)}
			</div>
		</div>
	);
};

export default memo(SliderItem);
