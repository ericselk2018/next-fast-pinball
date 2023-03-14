import { coinSlotSwitch, troughSwitches } from '../../const/Switches/Switches';
import Machine from '../../entities/Machine';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import AudioContext from '../AudioContext/AudioContext.client';
import { useSwitch } from 'lib/switch/switch';
import { autoStartBallsInPlay, startingCredits } from 'const/Setup/Setup';
import { useGameState } from 'lib/state/state';
import { useEvent } from 'lib/event/event';

// This context wraps everything, so non-null assertion is pretty safe and keeps consumer code cleaner.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const MachineContext = createContext<Machine>(null!);

export const MachineContextProvider = ({ children }: { children: ReactNode }) => {
	const audio = useContext(AudioContext);
	const [credits, setCredits] = useGameState(startingCredits);
	const [ballsInPlay, setBallsInPlay] = useGameState(autoStartBallsInPlay);
	const [gameStartEvent, notifyGameStartListeners] = useEvent();

	// Keep some global variables updated for debug purposes, so we can inspect them in browser console easily.
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(global as any).machine = {
			ballsInPlay,
		};
	}, [ballsInPlay]);

	useSwitch(
		() => {
			setCredits((credits) => credits + 1);
			audio.play({ name: 'rev' });
		},
		[audio, setCredits],
		coinSlotSwitch
	);

	const startGame = useCallback(() => {
		notifyGameStartListeners();
	}, [notifyGameStartListeners]);

	// Anytime the last/highest trough switch is hit, a ball drained.
	// PLAY-TEST: Can a ball ever go backwards in the trough?  If so, this logic will not work.
	// PLAY-TEST: Can two balls ever pass over this switch fast enough that it doesn't toggle in between?  If so, this logic will not work.
	useSwitch(
		() => {
			setBallsInPlay((ballsInPlay) => {
				console.log(`ball drained, setting balls in play to ${ballsInPlay - 1}`);
				return ballsInPlay - 1;
			});
		},
		[setBallsInPlay],
		troughSwitches[troughSwitches.length - 1]
	);

	// Eject ball whenever no balls in play, and one is ready to eject.
	// useEffect(() => {
	// 	setBallsInPlay((ballsInPlay) => {
	// 		if (!ballsInPlay && troughSlotsWithBallsSwitchIds.includes(troughBallOneSwitch.id)) {
	// 			setCurrentPlayerIndex(players.indexOf(nextPlayer));
	// 			hardware.ejectBall();
	// 			audio.play({ name: 'shot' });
	// 			console.log(`ball ejected, setting balls in play to ${ballsInPlay + 1}`);
	// 			return ballsInPlay + 1;
	// 		}
	// 		console.log(`ball not ejected, leaving balls in play at ${ballsInPlay}`);
	// 		return ballsInPlay;
	// 	});
	// }, []);

	const context: Machine = useMemo(
		() => ({
			get credits() {
				return credits;
			},
			set credits(value) {
				setCredits(value);
			},
			startGame,
			gameStartEvent,
			ballsInPlay,
		}),
		[credits, gameStartEvent, setCredits, startGame, ballsInPlay]
	);

	return <MachineContext.Provider value={context}>{children}</MachineContext.Provider>;
};

export default MachineContext;
