import styled, { css } from 'styled-components';

export const Container = styled.div(
	() => `
	display: flex;
	flex-direction: column;
`
);

export const Name = styled.div`
	font-size: 150px;
	text-align: center;
	text-decoration: underline;
	flex: 1;
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

export const Steps = styled.ol`
	font-size: 80px;
	list-style: decimal;
	list-style-position: inside;
`;

export const completeStep = css`
	@keyframes strike {
		0% {
			width: 0;
		}
		100% {
			width: 100%;
		}
	}

	::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		height: 0.1em;
		background: red;
		animation-name: strike;
		animation-duration: 1s;
		animation-timing-function: linear;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
	}
`;

export const Step = styled.li(
	({ complete, active }: { complete: boolean; active: boolean }) => `
	position: relative;
	width: fit-content;
	opacity: ${active ? '1' : '0.5'};

	${complete ? completeStep : ``}
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
