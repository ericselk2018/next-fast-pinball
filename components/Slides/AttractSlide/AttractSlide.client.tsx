import Blink from '../../../components/Blink/Blink.client';
import MachineContext from '../../../contexts/MachineContext/MachineContext';
import { useContext } from 'react';
import * as S from './AttractSlide.styles';

interface Props {
	playerInitials: string[];
	creditsRequired: number;
	creditsNeeded: number;
	selectedInitialIndex: number;
	selectedPlayerIndex: number;
	selectingNumberOfPlayers: boolean;
}

const AttractSlide = (props: Props) => {
	const {
		playerInitials,
		creditsRequired,
		creditsNeeded,
		selectedInitialIndex,
		selectedPlayerIndex,
		selectingNumberOfPlayers,
	} = props;

	const { credits } = useContext(MachineContext);
	return (
		<S.StyledSlide active={true}>
			<S.Video src="videos/attract.mp4" autoPlay={true} loop={true} />
			<S.Text>
				<div>
					Players: <Blink blinking={selectingNumberOfPlayers} text={playerInitials.length.toString()} />
				</div>
				<S.PlayerInitials>
					{playerInitials.map((playerInitials, index) => (
						<div key={index}>
							<Blink
								blinking={selectedPlayerIndex === index}
								blinkingLetter={selectedInitialIndex}
								text={playerInitials}
							/>
						</div>
					))}
				</S.PlayerInitials>
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
