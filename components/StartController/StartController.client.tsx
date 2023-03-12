import { GameContextProvider } from '../../contexts/GameContext/GameContext.client';
import { selectButtonSwitch, startButtonSwitch } from '../../const/Switches/Switches';
import { useContext, useState } from 'react';
import GameController from '../GameController/GameController.client';
import MachineContext from '../../contexts/MachineContext/MachineContext';
import { maxPlayers } from '../../const/Constraints/Constraints';
import AttractSlide from '../Slides/AttractSlide/AttractSlide.client';
import { creditsPerPlayer } from '../../const/Money/Money';
import { autoStartGamePlayers } from '../../const/Setup/Setup';
import AudioContext from '../../contexts/AudioContext/AudioContext.client';
import { useFlippers, useSwitch } from '../../lib/switch/switch';
import { replaceItemAtIndex } from '../../lib/array/array';
import { changeLetterAt } from '../../lib/string/string';

// This controller handles state and logic for starting a game, including:
//  Displays slide to attract players.
//  Allow pre-game setup like selecting number of players, skill level and user login from app (future features).
//  Ensures game is paid for before allowing start.
const StartController = () => {
	const machine = useContext(MachineContext);
	const audio = useContext(AudioContext);
	const { credits } = machine;
	const [playerInitials, setPlayerInitials] = useState(['AAA']);
	const [gameStarted, setGameStarted] = useState(!!autoStartGamePlayers);
	const [selected, setSelected] = useState([0, 0]);
	const selectingNumberOfPlayers = !selected[0];
	const selectedPlayerIndex = selected[0] - 1;
	const selectedInitialIndex = selected[1];
	const creditsRequired = creditsPerPlayer * playerInitials.length;
	const creditsNeeded = creditsRequired - credits;

	// Start game when start button hit, if enough credits.
	useSwitch(
		() => {
			if (!gameStarted) {
				if (creditsNeeded > 0) {
					audio.play({ name: 'crash' });
				} else {
					setGameStarted(true);
					machine.credits -= creditsRequired;
				}
			}
		},
		[audio, creditsNeeded, creditsRequired, machine, gameStarted],
		startButtonSwitch
	);

	// Flippers change selected value.
	useFlippers(
		(left) => {
			if (!gameStarted) {
				if (selectingNumberOfPlayers) {
					setPlayerInitials((playerInitials) => {
						if (left) {
							if (playerInitials.length > 1) {
								return playerInitials.slice(0, -1);
							}
						} else if (playerInitials.length < maxPlayers) {
							return [...playerInitials, 'AAA'];
						}
						return playerInitials;
					});
				} else {
					setPlayerInitials((playerInitials) =>
						replaceItemAtIndex({
							array: playerInitials,
							index: selectedPlayerIndex,
							item: changeLetterAt({
								text: playerInitials[selectedPlayerIndex],
								index: selectedInitialIndex,
								down: left,
							}),
						})
					);
				}
			}
		},
		[selectedInitialIndex, selectedPlayerIndex, selectingNumberOfPlayers, gameStarted]
	);

	// Update selection when selected button is pressed.
	useSwitch(
		() => {
			setSelected((selected) => {
				// If number of players is selected, move selection to first letter of initials for player 1
				if (selectingNumberOfPlayers) {
					return [1, 0];
				}
				// If the last initial is selected, we need to advance selection.
				else if (selectedInitialIndex === playerInitials[selectedPlayerIndex].length - 1) {
					// If last initial of last player is selected, return selection to number of players.
					if (selectedPlayerIndex === playerInitials.length - 1) {
						return [0, 0];
					} else {
						// Otherwise move selection to first initial of next player.
						return [selected[0] + 1, 0];
					}
				} else {
					// Otherwise move selection to next initial for current player.
					return [selected[0], selected[1] + 1];
				}
			});
		},
		[playerInitials, selectedInitialIndex, selectedPlayerIndex, selectingNumberOfPlayers],
		selectButtonSwitch
	);

	return gameStarted ? (
		<GameContextProvider playerInitials={playerInitials}>
			<GameController />
		</GameContextProvider>
	) : (
		<AttractSlide
			creditsNeeded={creditsNeeded}
			creditsRequired={creditsRequired}
			playerInitials={playerInitials}
			selectedPlayerIndex={selectedPlayerIndex}
			selectedInitialIndex={selectedInitialIndex}
			selectingNumberOfPlayers={selectingNumberOfPlayers}
		/>
	);
};

export default StartController;
