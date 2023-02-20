/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { UseDebounceProps } from '../interface';

function useDebounce({ value, delay }: UseDebounceProps) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value]);

	return debouncedValue;
}

export default useDebounce;
