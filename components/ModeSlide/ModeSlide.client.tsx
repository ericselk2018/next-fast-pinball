'use client';
import GameContext from '@/contexts/GameContext/GameContext.client';
import Mode from '@/entities/Mode/Mode';
import { useContext, useEffect, useRef } from 'react';
import Slide from '../Slide/Slide.client';
import * as S from './ModeSlide.styles';

interface Props {
	active: boolean;
	mode: Mode;
}

const ModeSlide = (props: Props) => {
	const { game } = useContext(GameContext);
	const { currentPlayer } = game;
	const { active, mode } = props;
	const { name, steps, video } = mode;
	const videoElement = useRef<HTMLVideoElement>(null);
	const playerMode = currentPlayer.modes.find((m) => m.name === mode.name);
	const firstNotCompleteStepIndex = playerMode?.steps.findIndex((step) => !step.complete);
	const activeStepIndex = firstNotCompleteStepIndex && firstNotCompleteStepIndex > 0 ? firstNotCompleteStepIndex : 0;

	useEffect(() => {
		if (videoElement.current) {
			if (active) {
				videoElement.current.currentTime = 0;
				videoElement.current.play();
			} else {
				videoElement.current.pause();
			}
		}
	}, [active, video]);

	return (
		<Slide active={active}>
			<S.Container>
				<S.Name>{name}</S.Name>
				<S.Bottom>
					<S.Left>
						<S.Steps>
							{steps.map((step, index) => {
								const { name, complete } = step;
								return (
									<S.Step key={index} complete={complete} active={activeStepIndex === index}>
										{name}
									</S.Step>
								);
							})}
						</S.Steps>
					</S.Left>
					<S.VideoContainer>
						<S.Video ref={videoElement} src={video} />
					</S.VideoContainer>
				</S.Bottom>
			</S.Container>
		</Slide>
	);
};

export default ModeSlide;
