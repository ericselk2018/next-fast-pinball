'use client';
import { ReactNode } from 'react';
import * as S from './Slide.styles';

interface Props {
	children: ReactNode;
	active: boolean;
	className?: string;
}

const Slide = (props: Props) => {
	const { children, active, className } = props;
	return (
		<S.Container active={active} className={className}>
			{children}
		</S.Container>
	);
};

export default Slide;
