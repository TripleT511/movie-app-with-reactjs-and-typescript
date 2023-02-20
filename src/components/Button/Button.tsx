import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { ReactNode, memo } from 'react';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);
interface ButtonProps {
	text?: string;
	url?: string;
	icon?: ReactNode;
	primary?: boolean;
	secondary?: boolean;
	transparent?: boolean;
	rounded?: boolean;
	disabled?: boolean;
	hasIconLabel?: boolean;
	hasIcon?: boolean;
	hasLabel?: boolean;
	iconMedium?: boolean;
	iconSmall?: boolean;
	btnPlay?: boolean;
	btnModel?: boolean;
	btnAuth?: boolean;
	btnClose?: boolean;
	btnSmall?: boolean;
	isSubmit?: boolean;
	onClick?: () => any;
}
const Button = ({
	text,
	url,
	icon,
	primary = false,
	secondary = false,
	transparent = false,
	rounded = false,
	disabled = false,
	hasIconLabel = false,
	hasIcon = false,
	iconMedium = false,
	iconSmall = false,
	btnPlay = false,
	btnModel = false,
	btnAuth = false,
	btnClose = false,
	btnSmall = false,
	isSubmit = false,
	onClick,
}: ButtonProps) => {
	if (url) {
		return (
			<Link
				to={url}
				className={cx('btn', {
					primary,
					secondary,
					transparent,
					rounded,
					disabled,
					hasIconLabel,
					hasIcon,
					btnModel,
					btnPlay,
					btnClose,
					btnSmall,
					btnAuth,
					'btn-icon': hasIcon ? true : false,
				})}
			>
				{icon && (
					<div
						className={cx('icon', {
							'mr-1': text ? true : false,
							iconMedium,
							iconSmall,
						})}
					>
						{icon}
					</div>
				)}
				<span className={cx('title')}>{text}</span>
			</Link>
		);
	}
	return (
		<button
			onClick={onClick}
			type={isSubmit ? 'submit' : 'button'}
			className={cx('btn', {
				primary,
				secondary,
				transparent,
				rounded,
				disabled,
				hasIconLabel,
				hasIcon,
				btnModel,
				btnPlay,
				btnClose,
				btnAuth,
				btnSmall,
				'btn-icon': hasIcon ? true : false,
			})}
		>
			{icon && (
				<div
					className={cx('icon', {
						'mr-1': text ? true : false,
						iconMedium,
						iconSmall,
					})}
				>
					{icon}
				</div>
			)}
			<span className={cx('title')}>{text}</span>
		</button>
	);
};

export default memo(Button);
