import Button from '../Button';
import config from '../../config';
import styles from './SignUp.module.scss';
import images from '../../assets/images';
import { UserInfo } from '../../interface';
import { setAuth } from '../../redux/actions';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import routes from '../../config/routes';

const cx = classNames.bind(styles);
const SignUp = () => {
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

		createUserWithEmailAndPassword(auth, email, password)
			.then((data) => {
				const { displayName, email, phoneNumber, photoURL, providerId } =
					data.user;
				const authData: UserInfo = {
					displayName: displayName ? displayName : 'Th??nh vi??n Netflix',
					email: email ? email : '',
					phoneNumber: phoneNumber ? phoneNumber : '',
					photoURL: photoURL ? photoURL : '',
					providerId: providerId ? providerId : '',
				};

				dispatch(setAuth(authData));
				navigate('/');
			})
			.catch((err) => {
				var errorCode = err.code;
				if (errorCode === 'auth/email-already-in-use') {
					setErrorAuth(errorCode);
				}
			});
	};

	return (
		<div className={cx('auth_wrapper', 'auth_wrapper')}>
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
						<h1 className={cx('title')}>????ng k??</h1>
						{errorAuth !== '' && (
							<div className={cx('error_container')}>
								<div className={cx('text')}>
									<span>
										R???t ti???c, Email n??y ???? t???n t???i tr??n h??? th???ng c???a ch??ng t??i.
									</span>
								</div>
							</div>
						)}

						<form
							onSubmit={(e) => handleSubmit(e)}
							method="post"
							className={cx('auth_form')}
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
										Vui l??ng nh???p email h???p l???.
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
										M???t kh???u
									</label>
									<button
										type="button"
										className={cx('password_toggle', 'password_toggle_login')}
										onClick={handleChangeTypePasword}
									>
										{typePassword ? 'Hi???n' : '???n'}
									</button>
								</div>
								{errorInput.errorPassword && (
									<div className={cx('input_error')}>
										M???t kh???u c???a b???n ph???i ch???a t??? 4 ?????n 60 k?? t???.
									</div>
								)}
							</div>
							<div className={cx('btn_submit')}>
								<Button btnAuth isSubmit text={'????ng k??'} />
							</div>
						</form>
					</div>
					<div className={cx('auth_body_content_order')}>
						<div className={cx('auth_signup_now')}>
							B???n ???? c?? t??i kho???n Netflix ?
							<Link to={routes.login} className={cx('auth_signup_link')}>
								????ng nh???p ngay
							</Link>
							.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
