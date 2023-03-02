import { rightFlipperButtonSwitch, leftFlipperButtonSwitch } from '@/const/Switches/Switches';
import GameContext from '@/contexts/GameContext/GameContext.client';
import HardwareContext from '@/contexts/HardwareContext/HardwareContext';
import { useContext, useEffect } from 'react';
import GameStatus from '../GameStatus/GameStatus';
import ModeSlide from '../Slides/ModeSlide/ModeSlide.client';
import * as S from './GameController.styles';

// StartController renders this after game is started.
// We now have access to GameContext, and any components we render also can access it.
const GameController = () => {
	const game = useContext(GameContext);
	const { currentMode, ballsInPlay, modes, addShot } = game;
	const { switches } = useContext(HardwareContext);
	const currentModeIndex = modes.findIndex((mode) => mode.name === currentMode.name);
	const rightFlipperButton = switches.find((aSwitch) => aSwitch.number === rightFlipperButtonSwitch.number);
	const leftFlipperButton = switches.find((aSwitch) => aSwitch.number === leftFlipperButtonSwitch.number);

	// TEMP - for UI testing, add shot when right flipper hit with balls in play
	useEffect(() => {
		if (rightFlipperButton && ballsInPlay) {
			return rightFlipperButton.addHitHandler({
				onHit: () => {
					addShot({ name: 'Super Combo Shot', points: 100000 });
				},
			});
		}
	}, [addShot, ballsInPlay, rightFlipperButton]);

	// TEMP - for UI testing, add shot when left flipper hit with balls in play
	useEffect(() => {
		if (leftFlipperButton && ballsInPlay) {
			return leftFlipperButton.addHitHandler({
				onHit: () => {
					addShot({ name: 'Insane Stunt', points: 10000 });
				},
			});
		}
	}, [addShot, ballsInPlay, leftFlipperButton]);

	// go to next mode on right flipper button hit without balls in play
	useEffect(() => {
		if (rightFlipperButton && !ballsInPlay) {
			return rightFlipperButton.addHitHandler({
				onHit: () => {
					if (currentModeIndex + 1 < modes.length) {
						game.currentMode = modes[currentModeIndex + 1];
					} else {
						game.currentMode = modes[0];
					}
				},
			});
		}
	}, [ballsInPlay, currentModeIndex, game, modes, rightFlipperButton]);

	// go to previous mode on left flipper button hit without balls in play
	useEffect(() => {
		if (leftFlipperButton && !ballsInPlay) {
			return leftFlipperButton.addHitHandler({
				onHit: () => {
					if (currentModeIndex > 0) {
						game.currentMode = modes[currentModeIndex - 1];
					} else {
						game.currentMode = modes[modes.length - 1];
					}
				},
			});
		}
	}, [ballsInPlay, currentModeIndex, game, leftFlipperButton, modes]);

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
