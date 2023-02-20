import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '../../../assets/images';
import config from '../../../config';
import { Link, useNavigate } from 'react-router-dom';
import Menu from '../Menu';
import { useEffect, useRef, useState, memo } from 'react';
import { RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAuth, signOut } from 'firebase/auth';
import {
	faPen,
	faQuestionCircle,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { setAuth } from '../../../redux/actions';
import Search from '../../../components/Search';

const cx = classNames.bind(styles);

const MenuItems = [
	{
		title: 'Trang chủ',
		to: config.routes.root,
	},
	{
		title: 'Phim H.động',
		to: config.routes.actionMovie,
	},
	{
		title: 'Phim',
		to: config.routes.actionMovie,
	},
	{
		title: 'Mới & Phổ biến',
		to: config.routes.actionMovie,
	},
	{
		title: 'Danh sách của tôi',
		to: config.routes.mylist,
	},
];

const MenuItems2 = [
	{
		title: 'Quản lý hồ sơ',
		icon: faPen,
	},
	{
		title: 'Tài khoản',
		icon: faUser,
	},
	{
		title: 'Trung tâm trợ giúp',
		icon: faQuestionCircle,
	},
];

const Header = () => {
	const { logo } = images;
	const headerRef = useRef<HTMLDivElement>(null);
	const [fixed, setFixed] = useState<boolean>(false);
	const user = useSelector((state: RootState) => state.auth);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const onScroll = () => {
			if (headerRef) {
				const topHeaderCurrent =
					headerRef.current?.getBoundingClientRect().top ?? 70;
				const windowY = window.scrollY;
				if (topHeaderCurrent < windowY) {
					setFixed(true);
				} else {
					setFixed(false);
				}
			}
		};

		window.addEventListener('scroll', onScroll);

		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, []);

	const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		const auth = getAuth();
		signOut(auth)
			.then(() => {
				dispatch(setAuth(undefined));
				navigate('/login');
			})
			.catch(console.error);
	};

	return (
		<header className={cx('header')} ref={headerRef}>
			<div
				className={cx('header-content', 'd-flex', 'flex-center', {
					fixed,
				})}
			>
				<div className={cx('header-content-left')}>
					<div className={cx('logo')}>
						<Link to={config.routes.root}>
							<img src={logo} alt="Logo" />
						</Link>
					</div>
					<Menu data={MenuItems} />
				</div>
				<div className={cx('header-content-right')}>
					<div className={cx('navigation-right')}>
						<div className={cx('nav-item')}>
							<Search />
						</div>
						<div className={cx('nav-item')}>
							<div className={cx('account-menu')}>
								<div className={cx('account-menu-dropdown')}>
									<Link to={config.routes.root}>
										<div className={cx('img')}>
											<img
												src={
													user?.photoURL === ''
														? images.userDefault
														: user?.photoURL
												}
												alt={user?.displayName}
											/>
											<div className={cx('callout-arrow')}></div>
										</div>
									</Link>
									<span className={cx('caret')}></span>
								</div>
								<div className={cx('menu')}>
									<div className={cx('content')}>
										<ul className={cx('sub-menu-list', 'profiles')}>
											<li>
												<Link className={cx('sub-menu-link')} to="/">
													<img
														src={
															user?.photoURL === ''
																? images.userDefault
																: user?.photoURL
														}
														alt={user?.displayName}
													/>
													<span>{user?.displayName}</span>
												</Link>
											</li>
										</ul>
										<ul className={cx('sub-menu-list', 'account-links')}>
											{MenuItems2 &&
												MenuItems2.map((item, index) => (
													<li key={index}>
														<Link className={cx('sub-menu-link')} to="/">
															<FontAwesomeIcon
																icon={item.icon}
																className={cx('icon')}
															/>
															<span>{item.title}</span>
														</Link>
													</li>
												))}
										</ul>
										<ul className={cx('sub-menu-list', 'sign-out-links')}>
											<li>
												<Link
													className={cx('sub-menu-link')}
													onClick={(e) => handleLogout(e)}
													to="#"
												>
													Đăng xuất khỏi Netflix
												</Link>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default memo(Header);
