import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { memo, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	getMoreSearchData,
	getOldSearchData,
	getSearchData,
	resetPageSearch,
} from '../../redux/actions';
import { useDebounce } from '../../hooks';
import config from '../../config';
import request from '../../utils/httpRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../../redux/store';

const cx = classNames.bind(styles);

const Search = () => {
	const [displaySearchInput, setDisplaySearchInput] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>('');
	const page = useSelector((state: RootState) => state.searchMovie.page);
	const currentKeyword = useSelector(
		(state: RootState) => state.searchMovie.keyword,
	);

	const totalPages = useSelector(
		(state: RootState) => state.searchMovie.totalPages,
	);

	const oldData = useSelector((state: RootState) => state.searchMovie.oldData);

	const searchInputRef = useRef<any>(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	const debounce = useDebounce({
		value: searchValue,
		delay: 400,
	});

	useEffect(() => {
		if (!debounce.trim()) {
			if (location.pathname === '/search') {
				dispatch(resetPageSearch());
				navigate('/');
			}
			return;
		}

		if (location.pathname !== '/search') {
			navigate('/search');
		}

		if (totalPages !== 0 && page > totalPages) {
			return;
		}

		const existKeyword = oldData?.findIndex(
			(item) => item.keyword === debounce,
		);

		const searchMovie = async () => {
			const res = await request(`3/search/movie`, {
				params: {
					api_key: config.api_key,
					query: encodeURIComponent(debounce),
					page: currentKeyword !== searchValue ? 1 : page,
				},
			});

			return res;
		};

		if (
			(existKeyword !== -1 && page === 1) ||
			(existKeyword !== -1 && currentKeyword !== searchValue)
		) {
			dispatch(getOldSearchData(oldData![existKeyword!]));
			dispatch(getMoreSearchData(oldData![existKeyword!].page + 1));
			return;
		} else {
			searchMovie()
				.then((res) => {
					const data = res.data;
					dispatch(
						getSearchData({
							keyword: debounce,
							results: data.results,
							page: data.page,
							totalPages: data.total_pages,
						}),
					);
				})
				.catch(console.error);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounce, page]);

	const handleClick = () => {
		setDisplaySearchInput(true);
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (e.currentTarget.id === 'searchInputWrapper') {
			e.preventDefault();
		}
	};

	const handleClear = () => {
		searchInputRef.current.focus();
		setDisplaySearchInput(true);
		setSearchValue('');
		dispatch(resetPageSearch());
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	const handleBlurInput = () => {
		setDisplaySearchInput(false);
	};

	const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		setSearchValue(e.target.value);
	};

	return (
		<div className={cx('search-box')}>
			{displaySearchInput ? (
				<div
					className={cx('search-input')}
					id="searchInputWrapper"
					onBlur={handleBlurInput}
					onMouseDown={(e) => handleMouseDown(e)}
				>
					<div className={cx('box-icon')}>
						<FontAwesomeIcon className={cx('icon')} icon={faSearch} />
					</div>
					<label htmlFor="searchInput"></label>
					<input
						ref={searchInputRef}
						value={searchValue}
						onChange={(e) => handleChangeSearchInput(e)}
						type="text"
						id="searchInput"
						className={cx('form-control')}
						placeholder="Phim, diễn viên, thể loại..."
						autoFocus
					/>
					<span role="button" onClick={handleClear}>
						<FontAwesomeIcon
							className={cx('clear', {
								active: searchValue !== '',
							})}
							icon={faTimes}
						/>
					</span>
				</div>
			) : (
				<button className={cx('search-btn')} onClick={handleClick}>
					<FontAwesomeIcon className={cx('icon')} icon={faSearch} />
				</button>
			)}
		</div>
	);
};

export default memo(Search);
