import Mode from '../../../entities/Mode';
import { useContext, useEffect, useRef } from 'react';
import * as S from './ModeSlide.styles';
import GameContext from 'contexts/GameContext/GameContext.client';
import Blink from 'components/Blink/Blink.client';

interface Props {
	active: boolean;
	mode: Mode;
}

const ModeSlide = (props: Props) => {
	const { ballsInPlay, currentModeStep, modeComplete, kickersWithBalls } = useContext(GameContext);
	const { active, mode } = props;
	const { name, video, steps } = mode;
	const videoElement = useRef<HTMLVideoElement>(null);

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
		<S.StyledSlide active={active}>
			<S.Top>
				<S.Name complete={modeComplete}>
					<Blink blinking={!ballsInPlay} text={name} />
				</S.Name>
			</S.Top>
			<S.Bottom>
				<S.Left>
					<S.Steps>
						{steps.map((step, index) => {
							const { name, switches, completedSwitches, count } = step;
							return (
								<S.Step
									complete={completedSwitches.length === count}
									active={!ballsInPlay || currentModeStep?.name === name}
									key={index}
								>
									<S.StepName>{name}</S.StepName>
									<S.StepImages>
										{switches.map((aSwitch, index) => {
											const { image, id } = aSwitch;
											const complete = completedSwitches.some(
												(completedSwitch) => completedSwitch.id === id
											);
											const available = !kickersWithBalls.some(
												(saucerHolesWithBall) => saucerHolesWithBall.id === id
											);
											return (
												<S.StepImage key={index} complete={complete} available={available}>
													<img src={image} />
												</S.StepImage>
											);
										})}
									</S.StepImages>
								</S.Step>
							);
						})}
					</S.Steps>
				</S.Left>
				<S.VideoContainer>
					<S.Video ref={videoElement} src={video} />
				</S.VideoContainer>
			</S.Bottom>
		</S.StyledSlide>
	);
};

export default ModeSlide;
