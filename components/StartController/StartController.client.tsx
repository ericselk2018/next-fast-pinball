import { GameContextProvider } from '@/contexts/GameContext/GameContext.client';
import { leftFlipperButtonSwitch, rightFlipperButtonSwitch, startButtonSwitch } from '@/const/Switches/Switches';
import { useContext, useEffect, useState } from 'react';
import GameController from '../GameController/GameController.client';
import MachineContext from '@/contexts/MachineContext/MachineContext';
import { maxPlayers } from '@/const/Constraints/Constraints';
import AttractSlide from '../Slides/AttractSlide/AttractSlide.client';
import { creditsPerPlayer } from '@/const/Money/Money';
import HardwareContext from '@/contexts/HardwareContext/HardwareContext';

// This controller handles state and logic for starting a game, including:
//  Displays slide to attract players.
//  Allow pre-game setup like selecting number of players, skill level and user login from app (future features).
//  Ensures game is paid for before allowing start.
const StartController = () => {
	const { switches } = useContext(HardwareContext);
	const machine = useContext(MachineContext);
	const { credits } = machine;
	const [playerCount, setPlayerCount] = useState(1);
	const [gameStartedPlayerCount, setGameStartedPlayerCount] = useState(0);
	const creditsRequired = creditsPerPlayer * playerCount;
	const creditsNeeded = creditsRequired - credits;
	const startButton = switches.find((aSwitch) => aSwitch.number === startButtonSwitch.number);
	const rightFlipperButton = switches.find((aSwitch) => aSwitch.number === rightFlipperButtonSwitch.number);
	const leftFlipperButton = switches.find((aSwitch) => aSwitch.number === leftFlipperButtonSwitch.number);

	// Start game when start button hit, if enough credits.
	useEffect(() => {
		if (startButton) {
			return startButton.addHitHandler({
				onHit: () => {
					if (creditsNeeded > 0) {
						// TODO: play sound, flash lights, play video, something fun
					} else {
						setGameStartedPlayerCount(playerCount);
						machine.credits -= creditsRequired;
					}
				},
			});
		}
	}, [creditsNeeded, creditsRequired, machine, playerCount, startButton]);

	// Left flipper to decrease player count.
	useEffect(() => {
		if (leftFlipperButton) {
			return leftFlipperButton.addHitHandler({
				onHit: () => {
					setPlayerCount((playerCount) => Math.max(playerCount - 1, 1));
				},
			});
		}
	}, [leftFlipperButton]);

	// Right flipper to increase player count.
	useEffect(() => {
		if (rightFlipperButton) {
			return rightFlipperButton.addHitHandler({
				onHit: () => {
					setPlayerCount((playerCount) => Math.min(playerCount + 1, maxPlayers));
				},
			});
		}
	}, [rightFlipperButton]);

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
