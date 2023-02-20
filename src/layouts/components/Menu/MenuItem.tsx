import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { MenuItemProps } from '../../../interface';
import { NavLink } from 'react-router-dom';

const cx = classNames.bind(styles);

const MenuItem = ({ title, to }: MenuItemProps) => {
	return (
		<NavLink
			className={({ isActive }) =>
				isActive ? cx('nav-link', 'active') : cx('nav-link')
			}
			to={to}
			title={title}
		>
			{title}
		</NavLink>
	);
};

export default MenuItem;
