import GameContext from '../../contexts/GameContext/GameContext.client';
import HardwareContext from '../../contexts/HardwareContext/HardwareContext';
import TargetSwitch from '../../entities/TargetSwitch';
import { useFlippers, useSwitch, useSwitches } from '../../lib/switch/switch';
import { useContext, useEffect } from 'react';
import GameStatus from '../GameStatus/GameStatus';
import ModeSlide from '../Slides/ModeSlide/ModeSlide.client';
import * as S from './GameController.styles';
import { startButtonSwitch } from 'const/Switches/Switches';

// StartController renders this after game is started.
// We now have access to GameContext, and any components we render also can access it.
const GameController = () => {
	const { enableFlippers, disableFlippers } = useContext(HardwareContext);
	const game = useContext(GameContext);
	const { ballsInPlay, modes, currentModeIndex, currentModeStep, ejectBall } = game;
	const incompleteSwitches = currentModeStep?.incompleteSwitches || [];

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

	// Enable flippers only while a ball is in play.
	useEffect(() => {
		if (ballsInPlay) {
			enableFlippers();
		} else {
			disableFlippers();
		}
	}, [ballsInPlay, disableFlippers, enableFlippers]);

	// When a switch in the current step is hit, mark as complete.
	useSwitches(
		(switchInfo: TargetSwitch) => {
			currentModeStep?.completeSwitch({ switch: switchInfo });
		},
		[currentModeStep],
		incompleteSwitches
	);

	// Eject ball using start button while no balls in play.
	useSwitch(
		() => {
			ejectBall();
		},
		[ejectBall],
		startButtonSwitch
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
