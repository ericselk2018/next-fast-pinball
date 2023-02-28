'use client';
import { ReactNode } from 'react';
import * as S from './Slide.styles';

interface Props {
	children: ReactNode;
	active: boolean;
}

const Slide = (props: Props) => {
	const { children, active } = props;
	return <S.Container active={active}>{children}</S.Container>;
};

export default Slide;
