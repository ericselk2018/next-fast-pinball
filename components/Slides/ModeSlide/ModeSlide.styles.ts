import styled, { css } from 'styled-components';
import Slide from '../Slide/Slide.client';

export const StyledSlide = styled(Slide)`
	display: flex;
	flex-direction: column;
`;

export const Top = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const Name = styled.div`
	font-size: 100px;
	text-align: center;
	text-decoration: underline;
`;

export const Bottom = styled.div`
	display: flex;
	align-items: center;
`;

export const Left = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`;

export const Steps = styled.div`
	flex: 1;
	font-size: 70px;
	line-height: 0.8;
	padding: 0 40px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const StepName = styled.div`
	text-align: center;
	width: 210px;
	overflow: hidden;
`;

export const Step = styled.div(
	({ complete, active }: { complete: boolean; active: boolean }) => `
	opacity: ${active ? '1' : '0.5'};
	display: flex;
	align-items: center;
	gap: 40px;
`
);

export const StepImages = styled.div`
	display: flex;
	gap: 10px;
`;

export const StepImage = styled.div(
	({ complete }: { complete: boolean }) => `

	img {
		display: block;
		width: 150px;
		height: 150px;	
	}
`
);

export const VideoContainer = styled.div`
	position: relative;

	::after {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50px;
		content: '';
		background-image: linear-gradient(black, transparent);
	}

	::before {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 50px;
		content: '';
		background-image: linear-gradient(to right, black, transparent);
	}
`;

export const Video = styled.video`
	width: 100%;
`;
