import React from 'react';
import styles from './FilterButton.module.css';

interface FilterButtonProps {
	onClick: () => void;
	children: string;
	isActive: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({
	onClick,
	children,
	isActive,
}) => {
	return (
		<button
			className={`${styles.button} ${isActive ? styles.active : ''}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default FilterButton;
