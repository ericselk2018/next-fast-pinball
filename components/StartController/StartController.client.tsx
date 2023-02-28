import { GameContextProvider } from '@/contexts/GameContext/GameContext.client';
import { useSwitchHit } from '@/contexts/HardwareContext/HardwareContext';
import { coinSlotSwitch, startButtonSwitch } from '@/const/Switches/Switches';
import { useState } from 'react';
import GameController from '../GameController/GameController.client';

const StartController = () => {
	const [gameStartedCredits, setGameStartedCredits] = useState(0);
	const [credits, setCredits] = useState(0);

	useSwitchHit({
		switch: coinSlotSwitch,
		onHit: () => {
			setCredits((coinsInserted) => coinsInserted + 1);
		},
	});

	useSwitchHit({
		switch: startButtonSwitch,
		onHit: () => {
			setGameStartedCredits(credits);
			setCredits(0);
		},
	});

	return gameStartedCredits ? (
		<GameContextProvider playerCount={gameStartedCredits}>
			<GameController />
		</GameContextProvider>
	) : credits ? (
		<>
			<div>Credits: {credits}</div>
			<div>Press Start</div>
		</>
	) : (
		<div>Insert Coin</div>
	);
};

export default StartController;
