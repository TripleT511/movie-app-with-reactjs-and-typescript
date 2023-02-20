import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { MenuProps } from '../../../interface';
import MenuItem from './MenuItem';

const cx = classNames.bind(styles);

const Menu = ({ data }: MenuProps) => {
	return (
		<ul className={cx('navigation')}>
			<li className={cx('nav-menu-tab')}>
				<MenuItem title="Duyệt tìm" to="#" />
				<div className={cx('sub-menu')}>
					<div className={cx('arrow')}></div>
					<ul className={cx('sub-menu-list')}>
						{data &&
							data.map((item, index) => (
								<li key={index}>
									<MenuItem title={item.title} to={item.to} />
								</li>
							))}
					</ul>
				</div>
			</li>
			{data &&
				data.map((item, index) => (
					<li key={index}>
						<MenuItem title={item.title} to={item.to} />
					</li>
				))}
		</ul>
	);
};

export default Menu;
