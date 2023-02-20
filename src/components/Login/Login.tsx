import Button from '../Button';
import config from '../../config';
import styles from './Login.module.scss';
import images from '../../assets/images';
import { UserInfo } from '../../interface';
import { setAuth } from '../../redux/actions';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../../firebase/config';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useRef, useState } from 'react';
import routes from '../../config/routes';

const cx = classNames.bind(styles);
const Login = () => {
	const { bg_auth, logo } = images;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorInput, setErrorInput] = useState({
		errorEmail: false,
		errorPassword: false,
	});
	const [typePassword, setTypePassword] = useState<boolean>(true);
	const [displayToggleBtn, setDisplayToggleBtn] = useState<boolean>(false);
	const [errorAuth, setErrorAuth] = useState<string>('');

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleLoginWithGoogle = useCallback(() => {
		signInWithPopup(auth, provider.google)
			.then((data) => {
				const { displayName, email, phoneNumber, photoURL, providerId } =
					data.user;
				const authData: UserInfo = {
					displayName: displayName ? displayName : 'Thành viên Netflix',
					email: email ? email : '',
					phoneNumber: phoneNumber ? phoneNumber : '',
					photoURL: photoURL ? photoURL : '',
					providerId: providerId ? providerId : '',
				};
				dispatch(setAuth(authData));
				navigate('/');
			})
			.catch((err) => {
				console.error(err);
				console.clear();
			});
	}, []);

	const passwordRef = useRef<any>(null);

	const handleFocusPassword = () => {
		setDisplayToggleBtn(true);
	};

	const handleChangeTypePasword = () => {
		passwordRef.current.focus();
		setTypePassword(!typePassword);
	};

	const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		const isValidate = val.length >= 4 && val.length <= 60;
		setErrorInput((prev) => ({
			...prev,
			errorPassword: !isValidate,
		}));
		setPassword(val);
	};

	const handleBlurInputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		const regex = new RegExp(
			'^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$',
		);
		const val = e.target.value;

		setErrorInput((prev) => ({
			...prev,
			errorEmail: !regex.test(val),
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			errorInput.errorEmail ||
			errorInput.errorPassword ||
			email.length === 0 ||
			password.length === 0
		) {
			return false;
		}

		signInWithEmailAndPassword(auth, email, password)
			.then((data) => {
				const { displayName, email, phoneNumber, photoURL, providerId } =
					data.user;
				const authData: UserInfo = {
					displayName: displayName ? displayName : 'Thành viên Netflix',
					email: email ? email : '',
					phoneNumber: phoneNumber ? phoneNumber : '',
					photoURL: photoURL ? photoURL : '',
					providerId: providerId ? providerId : '',
				};
				dispatch(setAuth(authData));
				navigate('/');
			})
			.catch((err) => {
				console.clear();
				var errorCode = err.code;
				setErrorAuth(errorCode);
			});
	};

	return (
		<div className={cx('auth_wrapper')}>
			<div className={cx('auth_wrapper_background')}>
				<img src={bg_auth} alt="Login Background" />
			</div>
			<div className={cx('auth_wrapper_header')}>
				<Link to={config.routes.root}>
					<img src={logo} alt="Logo" />
				</Link>
			</div>
			<div className={cx('auth_wrapper_body')}>
				<div className={cx('auth_body_content')}>
					<div className={cx('auth_body_content_main')}>
						<h1 className={cx('title')}>Đăng nhập</h1>
						{errorAuth !== '' && (
							<div className={cx('error_container')}>
								<div className={cx('text')}>
									{errorAuth === 'auth/user-not-found' ? (
										<>
											<span>
												Rất tiếc, chúng tôi không tìm thấy tài khoản nào có địa
												chỉ email này. Vui lòng thử lại hoặc
											</span>
											<Link to={routes.signup}> tạo một tài khoản mới.</Link>
										</>
									) : (
										<span>Mật khẩu không chính xác.</span>
									)}
								</div>
							</div>
						)}

						<form
							onSubmit={(e) => handleSubmit(e)}
							method="post"
							className={cx('login_form')}
							action=""
						>
							<div className={cx('input_placement')}>
								<div
									className={cx('form_input', {
										form_input_error: errorInput.errorEmail,
									})}
								>
									<input
										type="text"
										className={cx('form_control', {
											hasText: email !== '',
										})}
										id="emailInput"
										value={email}
										onFocus={() => {
											setDisplayToggleBtn(false);
										}}
										onBlur={(e) => handleBlurInputEmail(e)}
										onChange={(e) => setEmail(e.target.value)}
									/>
									<label htmlFor="emailInput" className={cx('label')}>
										Email
									</label>
								</div>
								{errorInput.errorEmail && (
									<div className={cx('input_error')}>
										Vui lòng nhập email hợp lệ.
									</div>
								)}
							</div>
							<div className={cx('input_placement')}>
								<div
									className={cx('form_input', {
										form_input_error: errorInput.errorPassword,
									})}
								>
									<input
										type={typePassword ? 'password' : 'text'}
										className={cx('form_control', 'form_password', {
											hasText: password !== '' ? true : false,
											toggle_password: displayToggleBtn,
										})}
										id="passwordInput"
										ref={passwordRef}
										onChange={(e) => handleChangePassword(e)}
										onFocus={handleFocusPassword}
										value={password}
									/>
									<label htmlFor="passwordInput" className={cx('label')}>
										Mật khẩu
									</label>
									<button
										type="button"
										className={cx('password_toggle', 'password_toggle_login')}
										onClick={handleChangeTypePasword}
									>
										{typePassword ? 'Hiện' : 'Ẩn'}
									</button>
								</div>
								{errorInput.errorPassword && (
									<div className={cx('input_error')}>
										Mật khẩu của bạn phải chứa từ 4 đến 60 ký tự.
									</div>
								)}
							</div>
							<div className={cx('btn_submit')}>
								<Button btnAuth isSubmit text={'Đăng nhập'} />
							</div>
							<div className={cx('btn_submit')}>
								<Button
									onClick={handleLoginWithGoogle}
									btnAuth
									text={'Tiếp tục với Google'}
								/>
							</div>
						</form>
					</div>
					<div className={cx('auth_body_content_order')}>
						<div className={cx('auth_signup_now')}>
							Bạn mới tham gia Netflix ?
							<Link to={routes.signup} className={cx('auth_signup_link')}>
								Đăng ký ngay
							</Link>
							.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
