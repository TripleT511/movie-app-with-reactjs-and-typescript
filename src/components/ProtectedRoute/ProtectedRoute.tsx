import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ReactNode, useState, useEffect, memo } from 'react';
import { UserInfo } from '../../interface';
import { auth } from '../../firebase/config';
import styles from './ProtectedRoute.module.scss';
import { setAuth } from '../../redux/actions';
import images from '../../assets/images';
import { RootState } from '../../redux/store';
import routes from '../../config/routes';

interface ProtectedRouteProps {
	children: ReactNode;
}

const cx = classNames.bind(styles);
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [user, setUser] = useState<boolean>(false);
	const userInfo = useSelector((state: RootState) => state.auth);
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
			if (currentuser) {
				const { displayName, email, phoneNumber, photoURL, providerId } =
					currentuser;
				const authData: UserInfo = {
					displayName: displayName ? displayName : 'Thành viên Netflix',
					email: email ? email : '',
					phoneNumber: phoneNumber ? phoneNumber : '',
					photoURL: photoURL ? photoURL : '',
					providerId: providerId ? providerId : '',
				};

				dispatch(setAuth(authData));
			} else {
				navigate(routes.login);
			}
		});

		return () => {
			unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleClick = () => {
		setUser(!user);
	};

	return (
		<>
			{!user ? (
				<div className={cx('profile_gate_container')}>
					{userInfo && (
						<div className={cx('body')}>
							<h1 className={cx('profile_gate_label')}>Ai đang xem?</h1>
							<div className={cx('account_wrapper')}>
								<div
									className={cx('account_wrapper_item')}
									onClick={handleClick}
								>
									<div className={cx('img')}>
										<img
											src={
												userInfo.photoURL !== ''
													? userInfo.photoURL
													: images.userDefault
											}
											alt={userInfo.displayName}
										/>
									</div>
									<p className={cx('name')}>{userInfo.displayName}</p>
								</div>
							</div>
						</div>
					)}
				</div>
			) : (
				children
			)}
		</>
	);
};

export default memo(ProtectedRoute);
