interface LoadingItemProps {
	delay: string;
}

const LoadingItem = ({ delay }: LoadingItemProps) => {
	return (
		<div className="loading_item">
			<div
				className="loading_content"
				style={{
					WebkitAnimationDelay: delay,
					animationDelay: delay,
				}}
			></div>
		</div>
	);
};

export default LoadingItem;
