import styled from 'styled-components';
import Slide from '../Slide/Slide.client';

export const StyledSlide = styled(Slide)``;

export const Video = styled.video`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
`;

export const Text = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 100px;
	background-color: rgba(0, 0, 0, 0.5);
`;

export const PlayerInitials = styled.div`
	display: flex;
	gap: 1em;
`;
