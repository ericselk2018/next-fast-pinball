import modes from '@/const/Modes/Modes';
import { leftFlipperButtonSwitch, rightFlipperButtonSwitch } from '@/const/Switches/Switches';
import GameContext from '@/contexts/GameContext/GameContext.client';
import HardwareContext from '@/contexts/HardwareContext/HardwareContext';
import { useContext, useEffect, useState } from 'react';
import ModeSlide from '../ModeSlide/ModeSlide.client';
import * as S from './ModeSelect.styles';

const ModeSelect = () => {
	const { switches } = useContext(HardwareContext);
	const game = useContext(GameContext);
	const { currentMode, modes } = game;
	const currentModeIndex = modes.findIndex((mode) => mode.name === currentMode.name);
	const rightFlipperButton = switches.find((aSwitch) => aSwitch.number === rightFlipperButtonSwitch.number);
	const leftFlipperButton = switches.find((aSwitch) => aSwitch.number === leftFlipperButtonSwitch.number);

	// go to next mode on right flipper button hit
	useEffect(() => {
		if (rightFlipperButton) {
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
	}, [currentModeIndex, game, modes, rightFlipperButton]);

	// go to previous mode on left flipper button hit
	useEffect(() => {
		if (leftFlipperButton) {
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
	}, [currentModeIndex, game, leftFlipperButton, modes]);

	return (
		<S.Container>
			{modes.map((mode, index) => (
				<ModeSlide key={index} active={currentModeIndex === index} mode={mode} />
			))}
		</S.Container>
	);
};

export default ModeSelect;
