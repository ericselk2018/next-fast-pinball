import { GameContextProvider } from '@/contexts/GameContext/GameContext.client';
import { useSwitchHit } from '@/contexts/HardwareContext/HardwareContext';
import { leftFlipperButtonSwitch, rightFlipperButtonSwitch, startButtonSwitch } from '@/const/Switches/Switches';
import { useContext, useState } from 'react';
import GameController from '../GameController/GameController.client';
import MachineContext from '@/contexts/MachineContext/MachineContext';
import { maxPlayers } from '@/const/Constraints/Constraints';
import AttractSlide from '../Slides/AttractSlide/AttractSlide.client';
import { creditsPerPlayer } from '@/const/Money/Money';

// This controller handles state and logic for starting a game, including:
//  Displays slide to attract players.
//  Allow pre-game setup like selecting number of players, skill level and user login from app (future features).
//  Ensures game is paid for before allowing start.
const StartController = () => {
	const { credits, consumeCredits } = useContext(MachineContext);
	const [playerCount, setPlayerCount] = useState(1);
	const [gameStartedPlayerCount, setGameStartedPlayerCount] = useState(0);
	const creditsRequired = creditsPerPlayer * playerCount;
	const creditsNeeded = creditsRequired - credits;

	useSwitchHit({
		switch: startButtonSwitch,
		onHit: () => {
			if (creditsNeeded > 0) {
				// TODO: play sound, flash lights, play video, something fun
			} else {
				setGameStartedPlayerCount(playerCount);
				consumeCredits({ creditsUsed: creditsRequired });
			}
		},
	});

	// Left flipper to decrease player count.
	useSwitchHit({
		switch: leftFlipperButtonSwitch,
		onHit: () => {
			setPlayerCount((playerCount) => Math.max(playerCount - 1, 0));
		},
	});

	// Right flipper to increase player count.
	useSwitchHit({
		switch: rightFlipperButtonSwitch,
		onHit: () => {
			setPlayerCount((playerCount) => Math.min(playerCount + 1, maxPlayers));
		},
	});

	// FUTURE: Add select button to support selecting more than just number of players.

	return gameStartedPlayerCount ? (
		<GameContextProvider playerCount={gameStartedPlayerCount}>
			<GameController />
		</GameContextProvider>
	) : (
		<AttractSlide creditsNeeded={creditsNeeded} creditsRequired={creditsRequired} playerCount={playerCount} />
	);
};

export default StartController;
