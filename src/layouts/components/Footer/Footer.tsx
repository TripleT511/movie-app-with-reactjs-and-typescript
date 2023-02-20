import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import images from '../../../assets/images';
import Button from '../../../components/Button';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

const MenuItems = [
	{
		title: 'Mô tả âm thanh',
		to: '/',
	},
	{
		title: 'Trung tâm trợ giúp',
		to: '/',
	},
	{
		title: 'Thẻ quà tặng',
		to: '/',
	},
	{
		title: 'Trung tâm đa phương tiện',
		to: '/',
	},
	{
		title: 'Quan hệ với nhà đầu tư',
		to: '/',
	},
	{
		title: 'Việc làm',
		to: '/',
	},
	{
		title: 'Điều khoản sử dụng',
		to: '/',
	},
	{
		title: 'Quyền riêng tư',
		to: '/',
	},
	{
		title: 'Thông báo pháp lý',
		to: '/',
	},
	{
		title: 'Tuỳ chọn cookie',
		to: '/',
	},
	{
		title: 'Thông tin doanh nghiệp',
		to: '/',
	},
	{
		title: 'Liên hệ với chúng tôi',
		to: '/',
	},
];

const Footer = () => {
	const { icon_fb, icon_instagram, icon_twitter, icon_youtube } = images;
	return (
		<footer className={cx('footer')}>
			<div className={cx('container')}>
				<div className={cx('social_links')}>
					<Link to="/">
						<img src={icon_fb} alt="Facebook" />
					</Link>
					<Link to="/">
						<img src={icon_instagram} alt="Instagram" />
					</Link>
					<Link to="/">
						<img src={icon_twitter} alt="Twitter" />
					</Link>
					<Link to="/">
						<img src={icon_youtube} alt="Youtube" />
					</Link>
				</div>
				<ul className={cx('member_footer_links')}>
					{MenuItems.map((item, index) => (
						<li key={index} className={cx('member_footer_item')}>
							<Link to={item.to}>
								<span className={cx('member_footer_content')}>
									{item.title}
								</span>
							</Link>
						</li>
					))}
				</ul>
				<div className={cx('member_footer_service')}>
					<button className={cx('service_code')}>Mã dịch vụ</button>
				</div>
				<div className={cx('member_footer_copyright')}>
					<span>© 1997-2023 Netflix Clone, Inc.&lrm;</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
