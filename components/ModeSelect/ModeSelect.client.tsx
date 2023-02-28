import modes from '@/const/Modes/Modes';
import { leftFlipperButtonSwitch, rightFlipperButtonSwitch } from '@/const/Switches/Switches';
import GameContext from '@/contexts/GameContext/GameContext.client';
import { useSwitchHit } from '@/contexts/HardwareContext/HardwareContext';
import { useContext, useState } from 'react';
import ModeSlide from '../ModeSlide/ModeSlide.client';
import * as S from './ModeSelect.styles';

const ModeSelect = () => {
	const { game, activeModeIndex, setActiveModeIndex } = useContext(GameContext);
	const { currentPlayer } = game;

	// go to next mode on right flipper button hit
	useSwitchHit({
		switch: rightFlipperButtonSwitch,
		onHit: () => {
			if (activeModeIndex + 1 < modes.length) {
				setActiveModeIndex(activeModeIndex + 1);
			} else {
				setActiveModeIndex(0);
			}
		},
	});

	// go to previous mode on left flipper button hit
	useSwitchHit({
		switch: leftFlipperButtonSwitch,
		onHit: () => {
			if (activeModeIndex > 0) {
				setActiveModeIndex(activeModeIndex - 1);
			} else {
				setActiveModeIndex(modes.length - 1);
			}
		},
	});

	return (
		<S.Container>
			{modes.map((mode, index) => (
				<ModeSlide key={index} active={activeModeIndex === index} mode={mode} />
			))}
		</S.Container>
	);
};

export default ModeSelect;
