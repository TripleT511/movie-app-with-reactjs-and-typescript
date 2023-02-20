import { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTopPositionModel } from '../../redux/actions';

interface PositionScrollProps {
	top: string;
}

const PositionScroll = ({ top }: PositionScrollProps) => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (top !== '0px') {
			dispatch(setTopPositionModel(top));
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [top]);

	return <div></div>;
};

export default memo(PositionScroll);
