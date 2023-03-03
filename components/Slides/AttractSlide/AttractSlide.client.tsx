import MachineContext from '@/contexts/MachineContext/MachineContext';
import { useContext } from 'react';
import * as S from './AttractSlide.styles';

interface Props {
	playerCount: number;
	creditsRequired: number;
	creditsNeeded: number;
}

const AttractSlide = (props: Props) => {
	const { playerCount, creditsRequired, creditsNeeded } = props;

	const { credits } = useContext(MachineContext);
	return (
		<S.StyledSlide active={true}>
			<S.Video src="attract.mp4" autoPlay={true} loop={true} />
			<S.Text>
				<div>Players: {playerCount}</div>
				<div>
					Credits: {credits}/{creditsRequired}
				</div>
				<div>
					{creditsNeeded === 1
						? 'Insert Coin'
						: creditsNeeded > 1
						? `Insert ${creditsNeeded} Coins`
						: 'Press Start'}
				</div>
			</S.Text>
		</S.StyledSlide>
	);
};

export default AttractSlide;
