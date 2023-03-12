import GameContext from '../../contexts/GameContext/GameContext.client';
import HardwareContext from '../../contexts/HardwareContext/HardwareContext';
import TargetSwitch from '../../entities/TargetSwitch';
import { useFlippers, useSwitch, useSwitches } from '../../lib/switch/switch';
import { useContext, useEffect } from 'react';
import GameStatus from '../GameStatus/GameStatus';
import ModeSlide from '../Slides/ModeSlide/ModeSlide.client';
import * as S from './GameController.styles';
import { kickerSwitches, startButtonSwitch } from 'const/Switches/Switches';
import { kickers } from 'const/Kickers/Kickers';
import AudioContext from 'contexts/AudioContext/AudioContext.client';
import { totalBallsInMachine } from 'const/Setup/Setup';

// StartController renders this after game is started.
// We now have access to GameContext, and any components we render also can access it.
const GameController = () => {
	const audio = useContext(AudioContext);
	const { enableFlippers, disableFlippers } = useContext(HardwareContext);
	const game = useContext(GameContext);
	const {
		ballsInPlayUpdatePending,
		ballsInPlay,
		modes,
		currentModeIndex,
		currentModeStep,
		ejectBall,
		kickBall,
		kickersWithBalls,
		modeComplete,
	} = game;
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
			if (!ballsInPlay && !ballsInPlayUpdatePending) {
				ejectBall();
			}
		},
		[ballsInPlay, ejectBall, ballsInPlayUpdatePending],
		startButtonSwitch
	);

	// Kick balls when they enter a kicker at the wrong time.
	useSwitches(
		(switchInfo) => {
			const isTarget = currentModeStep?.switches.find((s) => s.id === switchInfo.id);
			if (!isTarget) {
				const kicker = kickers.find((kicker) => kicker.switchInfo.id === switchInfo.id);
				if (kicker) {
					audio.play({ name: 'crash' });
					setTimeout(() => {
						kickBall({ kicker });
					}, 1000);
				}
			}
		},
		[currentModeStep?.switches, audio, kickBall],
		kickerSwitches
	);

	// When a mode is complete and all kickers are full, or all balls are in kickers,
	//  we kick all balls from kickers to start multi - ball.
	useEffect(() => {
		if (
			(kickersWithBalls.length === totalBallsInMachine || kickersWithBalls.length === kickerSwitches.length) &&
			modeComplete
		) {
			// Timeout is mostly for dramatic effect - suspense.
			setTimeout(() => {
				kickersWithBalls.forEach((kickerWithBall) => {
					const kicker = kickers.find((kicker) => kicker.switchInfo.id === kickerWithBall.id);
					if (kicker) {
						kickBall({ kicker });
					}
				});
			}, 1000);
		}
	}, [kickBall, modeComplete, kickersWithBalls]);

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
