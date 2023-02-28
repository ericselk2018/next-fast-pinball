import GameContext from '@/contexts/GameContext/GameContext.client';
import Mode from '@/entities/Mode/Mode';
import { useRef, useState } from 'react';
import Slide from '../Slide/Slide.client';
import * as S from './Play.styles';

interface Props {
	mode: Mode;
}

const Play = (props: Props) => {
	const { mode } = props;
	const { name, steps } = mode;
	const videoElement = useRef<HTMLVideoElement>(null);
	const [video] = useState('');

	return (
		<Slide active={true}>
			<S.Container>
				<S.Name>{name}</S.Name>
				<S.Bottom>
					<S.Left>
						<S.Steps>
							{steps.map((step, index) => {
								const { name } = step;
								return (
									<S.Step key={index} complete={false} active={false}>
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

export default Play;
