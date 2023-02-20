import classNames from 'classnames/bind';
import Header from '../components/Header';
import styles from './Layout.module.scss';
import { ChildrenProps } from '../../interface';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ModelVideo from '../../components/ModelVideo';
import { useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import PositionScroll from '../../components/PositionScroll';

const cx = classNames.bind(styles);

const Layout = ({ children }: ChildrenProps) => {
	const fullscreen = useSelector(
		(state: RootState) => state.videoModel.fullscreen,
	);

	const topPosition = useSelector(
		(state: RootState) => state.videoModel.topPosition,
	);
	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!fullscreen) {
			let scrollY = 0;
			if (topPosition) {
				scrollY =
					parseFloat(topPosition.slice(0, topPosition?.length - 2)) * -1;
			}

			window.scroll(0, scrollY);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fullscreen]);

	return (
		<div
			ref={divRef}
			style={
				{
					position: !fullscreen ? 'relative' : 'unset',
					top: fullscreen
						? topPosition
							? topPosition
							: divRef.current
							? divRef.current.getBoundingClientRect().top + 'px'
							: '0px'
						: 'unset',
				} as React.CSSProperties
			}
		>
			<div
				className={cx('wrapper', {
					activeModel: fullscreen,
				})}
				style={
					{
						'--data-top': fullscreen
							? topPosition
								? topPosition
								: divRef.current
								? divRef.current.getBoundingClientRect().top + 'px'
								: '0px'
							: 'unset',
					} as React.CSSProperties
				}
			>
				<Header />
				<div className={cx('main-view')}>{children}</div>
				<Footer />
			</div>
			<PositionScroll
				top={
					divRef.current
						? divRef.current.getBoundingClientRect().top + 'px'
						: '0px'
				}
			/>
			{fullscreen && <ModelVideo active />}
		</div>
	);
};

export default Layout;
