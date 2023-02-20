import className from 'classnames/bind';
import LoadingItem from '../LoadingItem';
import styles from './Slider.module.scss';

const cx = className.bind(styles);

const SliderLazy = () => {
	return (
		<div className={cx('container')}>
			<div className={cx('wrapper_title')}>
				<h2 className={cx('header_title', 'header_title_effect')}>
					<div className={cx('title_link')}>
						<span className={cx('title', 'loading')}>&nbsp;</span>
					</div>
				</h2>
			</div>

			<div className={cx('wrapper_slider')}>
				<div className={cx('slider_inner')}>
					<div className={cx('slider')}>
						{new Array(7).fill(0).map((item, index) => (
							<LoadingItem key={index} delay={`${index * 0.2}s`} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SliderLazy;
