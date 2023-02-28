import { creditsPerPlayer, maxPlayers } from '@/const/Constraints/Constraints';
import { startButtonSwitch, leftFlipperButtonSwitch, rightFlipperButtonSwitch } from '@/const/Switches/Switches';
import { useSwitchHit } from '@/contexts/HardwareContext/HardwareContext';
import MachineContext from '@/contexts/MachineContext/MachineContext';
import { useContext, useState } from 'react';
import * as S from './AttractSlide.styles';

interface Props {
	playerCount: number;
	creditsRequired: number;
	creditsNeeded: number;
}

// TODO: make this nice
const AttractSlide = (props: Props) => {
	const { playerCount, creditsRequired, creditsNeeded } = props;

	const { credits } = useContext(MachineContext);
	return (
		<S.StyledSlide active={true}>
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
		</S.StyledSlide>
	);
};

export default AttractSlide;
