import { GameContextProvider } from '@/contexts/GameContext/GameContext.client';
import { startButtonSwitch } from '@/const/Switches/Switches';
import { useContext, useState } from 'react';
import GameController from '../GameController/GameController.client';
import MachineContext from '@/contexts/MachineContext/MachineContext';
import { maxPlayers } from '@/const/Constraints/Constraints';
import AttractSlide from '../Slides/AttractSlide/AttractSlide.client';
import { creditsPerPlayer } from '@/const/Money/Money';
import { autoStartGamePlayers } from '@/const/Setup/Setup';
import AudioContext from '@/contexts/AudioContext/AudioContext.client';
import { useFlippers, useSwitch } from '@/lib/switch/switch';

// This controller handles state and logic for starting a game, including:
//  Displays slide to attract players.
//  Allow pre-game setup like selecting number of players, skill level and user login from app (future features).
//  Ensures game is paid for before allowing start.
const StartController = () => {
	const machine = useContext(MachineContext);
	const audio = useContext(AudioContext);
	const { credits } = machine;
	const [playerCount, setPlayerCount] = useState(1);
	const [gameStartedPlayerCount, setGameStartedPlayerCount] = useState(autoStartGamePlayers);
	const creditsRequired = creditsPerPlayer * playerCount;
	const creditsNeeded = creditsRequired - credits;

	// Start game when start button hit, if enough credits.
	useSwitch(
		() => {
			if (creditsNeeded > 0) {
				audio.play({ name: 'crash' });
			} else {
				setGameStartedPlayerCount(playerCount);
				machine.credits -= creditsRequired;
			}
		},
		[audio, creditsNeeded, creditsRequired, machine, playerCount],
		startButtonSwitch
	);

	// Flippers change player count.
	useFlippers((left) => {
		setPlayerCount((playerCount) => (left ? Math.max(playerCount - 1, 1) : Math.min(playerCount + 1, maxPlayers)));
	}, []);

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
