import GameContext from '@/contexts/GameContext/GameContext.client';
import { useFlippers } from '@/lib/switch/switch';
import { useContext } from 'react';
import GameStatus from '../GameStatus/GameStatus';
import ModeSlide from '../Slides/ModeSlide/ModeSlide.client';
import * as S from './GameController.styles';

// StartController renders this after game is started.
// We now have access to GameContext, and any components we render also can access it.
const GameController = () => {
	const game = useContext(GameContext);
	const { ballsInPlay, modes, currentModeIndex } = game;

	// Switch modes using flippers whenever no balls in play.
	useFlippers(
		(left) => {
			if (!ballsInPlay) {
				game.currentMode =
					modes[
						left
							? currentModeIndex > 0
								? currentModeIndex - 1
								: modes.length - 1
							: currentModeIndex + 1 < modes.length
							? currentModeIndex + 1
							: 0
					];
			}
		},
		[currentModeIndex, game, modes, ballsInPlay]
	);

	return (
		<S.Container>
			<GameStatus />
			<S.SlideContainer>
				{modes.map((mode, index) => (
					<ModeSlide key={index} active={currentModeIndex === index} mode={mode} />
				))}
			</S.SlideContainer>
		</S.Container>
	);
};

export default GameController;
