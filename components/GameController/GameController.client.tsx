import GameContext from '../../contexts/GameContext/GameContext.client';
import HardwareContext from '../../contexts/HardwareContext/HardwareContext';
import TargetSwitch from '../../entities/TargetSwitch';
import { useFlippers, useSwitches } from '../../lib/switch/switch';
import { useContext, useEffect } from 'react';
import GameStatus from '../GameStatus/GameStatus';
import ModeSlide from '../Slides/ModeSlide/ModeSlide.client';
import * as S from './GameController.styles';

// StartController renders this after game is started.
// We now have access to GameContext, and any components we render also can access it.
const GameController = () => {
	const { enableFlippers, disableFlippers } = useContext(HardwareContext);
	const game = useContext(GameContext);
	const { ballsInPlay, modes, currentModeIndex, currentModeStep, waitingForLaunch } = game;
	const incompleteSwitches = currentModeStep?.incompleteSwitches || [];

	// Switch modes using flippers whenever in waiting for launch state.
	useFlippers(
		(left) => {
			if (waitingForLaunch) {
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
		[currentModeIndex, game, modes, waitingForLaunch]
	);

	// Only enable flippers while balls in play and not waiting for launch.
	useEffect(() => {
		if (ballsInPlay && !waitingForLaunch) {
			enableFlippers();
		} else {
			disableFlippers();
		}
	}, [ballsInPlay, disableFlippers, enableFlippers, waitingForLaunch]);

	// When a switch in the current step is hit, mark as complete.
	useSwitches(
		(switchInfo: TargetSwitch) => {
			currentModeStep?.completeSwitch({ switch: switchInfo });
		},
		[currentModeStep],
		incompleteSwitches
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
