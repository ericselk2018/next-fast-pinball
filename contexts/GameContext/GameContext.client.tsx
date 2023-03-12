import modes, { ModeInfo, ModeStepInfo } from '../../const/Modes/Modes';
import { startingBallsPerPlayer, startingScore } from '../../const/Rules/Rules';
import {
	plungerRolloverSwitch,
	kickerSwitches,
	troughSwitches,
	troughBallOneSwitch,
	SwitchInfo,
} from '../../const/Switches/Switches';
import Game from '../../entities/Game';
import Mode from '../../entities/Mode';
import ModeStep from '../../entities/ModeStep';
import Player from '../../entities/Player';
import Shot from '../../entities/Shot';
import { filterUndefined, replaceItemAtIndex } from '../../lib/array/array';
import { useSwitch, useToggleSwitches } from '../../lib/switch/switch';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import HardwareContext from '../HardwareContext/HardwareContext';
import { autoStartBallsInPlay, totalBallsInMachine } from 'const/Setup/Setup';
import AudioContext from 'contexts/AudioContext/AudioContext.client';

interface CompletedTask {
	step: string;
	switchId: number;
}

// non-null assertion is to keep consumer code cleaner, if we try to use this context in a component
//  that isn't inside the context, at least we should have a very obvious error and fix it quickly.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const GameContext = createContext<Game>(null!);

export const GameContextProvider = ({
	children,
	playerInitials,
}: {
	children: ReactNode;
	playerInitials: string[];
}) => {
	const hardware = useContext(HardwareContext);
	const audio = useContext(AudioContext);
	const { targetSwitchInfoToTargetSwitch, isSwitchClosed } = hardware;
	const alreadyClosedSwitchIds = ({ switches }: { switches: ReadonlyArray<SwitchInfo> }) =>
		switches.filter((switchInfo) => isSwitchClosed({ switchInfo })).map((switchInfo) => switchInfo.id);
	const [scores, setScores] = useState(Array(playerInitials.length).fill(startingScore));
	const [totalBalls, setTotalBalls] = useState(Array(playerInitials.length).fill(startingBallsPerPlayer));
	const [usedBalls, setUsedBalls] = useState(Array(playerInitials.length).fill(0));
	const [modesCompleted, setModesCompleted] = useState<string[][]>(Array(playerInitials.length).fill([]));
	const [currentModeIndex, setCurrentModeIndex] = useState(0);
	const [tasksCompleted, setTasksCompleted] = useState<CompletedTask[]>([]);
	const [shots, setShots] = useState<Shot[]>([]);
	const [videoPlaying, setVideoPlaying] = useState('');
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
	const [kickersWithBallsSwitchIds, setKickersWithBallsSwitchIds] = useState<number[]>(
		alreadyClosedSwitchIds({ switches: kickerSwitches })
	);
	const [troughSlotsWithBallsSwitchIds, setTroughSlotsWithBallsSwitchIds] = useState<number[]>(
		alreadyClosedSwitchIds({ switches: troughSwitches })
	);
	const [ballEjecting, setBallEjecting] = useState(false);
	const [ballsInPlay, setBallsInPlay] = useState(autoStartBallsInPlay);

	// Keep some global variables updated for debug purposes, so we can inspect them in browser console easily.
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(global as any).game = {
			kickersWithBallsSwitchIds,
			troughSlotsWithBallsSwitchIds,
			kickersWithBalls: kickerSwitches
				.filter((switchInfo) => kickersWithBallsSwitchIds.includes(switchInfo.id))
				.map((switchInfo) => switchInfo.name),
			troughSlotsWithBalls: troughSwitches
				.filter((switchInfo) => troughSlotsWithBallsSwitchIds.includes(switchInfo.id))
				.map((switchInfo) => switchInfo.name),
			ballsInPlay,
			ballEjecting,
		};
	}, [kickersWithBallsSwitchIds, troughSlotsWithBallsSwitchIds, ballsInPlay, ballEjecting]);

	const modeStepInfoToModeStep = useCallback(
		(modeStepInfo: ModeStepInfo): ModeStep => {
			const { name, switches, count } = modeStepInfo;
			return {
				name,
				count: count || 1,
				switches: switches.map(targetSwitchInfoToTargetSwitch),
				completedSwitches: switches
					.filter((aSwitch) =>
						tasksCompleted.some((task) => task.step === modeStepInfo.name && task.switchId === aSwitch.id)
					)
					.map(targetSwitchInfoToTargetSwitch),
				incompleteSwitches: switches
					.filter(
						(aSwitch) =>
							!tasksCompleted.some(
								(task) => task.step === modeStepInfo.name && task.switchId === aSwitch.id
							)
					)
					.map(targetSwitchInfoToTargetSwitch),
				completeSwitch: (args) =>
					setTasksCompleted((tasksCompleted) => [
						...tasksCompleted,
						{ step: modeStepInfo.name, switchId: args.switch.id },
					]),
			};
		},
		[targetSwitchInfoToTargetSwitch, tasksCompleted]
	);

	const modeInfoToMode = useCallback(
		(modeInfo: ModeInfo): Mode => {
			const { name, steps, video } = modeInfo;
			return {
				name,
				video,
				steps: steps.map((step) => modeStepInfoToModeStep(step)),
			};
		},
		[modeStepInfoToModeStep]
	);

	const currentMode = modeInfoToMode(modes[currentModeIndex]);
	const currentModeStep = currentMode.steps.find((s) => s.completedSwitches.length < s.count);

	// For UI testing while doing dev work.
	// useEffect(() => {
	// 	setTimeout(() => {
	// 		setTasksCompleted([
	// 			{ step: currentMode.steps[0].name, switchId: currentMode.steps[0].switches[0].id },
	// 			// { step: currentMode.steps[0].name, switchId: currentMode.steps[0].switches[1].id },
	// 			// { step: currentMode.steps[0].name, switchId: currentMode.steps[0].switches[2].id },
	// 			// { step: currentMode.steps[0].name, switchId: currentMode.steps[0].switches[3].id },
	// 		]);
	// 	}, 3000);
	// }, [currentMode.steps]);

	const players: Player[] = playerInitials.map(
		(initials, index): Player => ({
			id: index + 1,
			initials,
			get totalBalls() {
				return totalBalls[index];
			},
			set totalBalls(value) {
				setTotalBalls(replaceItemAtIndex({ array: totalBalls, index, item: value }));
			},
			get usedBalls() {
				return usedBalls[index];
			},
			set usedBalls(value) {
				setUsedBalls(replaceItemAtIndex({ array: usedBalls, index, item: value }));
			},
			get ballsRemaining() {
				return this.totalBalls - this.usedBalls;
			},
			hasCompletedMode: ({ mode }: { mode: Mode }) => modesCompleted[index].includes(mode.name),
			completeMode: ({ mode }: { mode: Mode }) => {
				setModesCompleted((modesCompleted) => {
					if (modesCompleted[index].includes(mode.name)) {
						return modesCompleted;
					}
					return replaceItemAtIndex({
						array: modesCompleted,
						index,
						item: [...modesCompleted[index], mode.name],
					});
				});
			},
			get score() {
				return scores[index];
			},
			set score(value) {
				setScores(replaceItemAtIndex({ array: scores, index, item: value }));
			},
		})
	);

	const currentPlayer = players[currentPlayerIndex];
	const nextPlayer = players[currentPlayerIndex + 1 === players.length ? 0 : currentPlayerIndex + 1];

	const addShot = useCallback((shot: Shot) => {
		setShots((shots) => [...shots, shot]);
	}, []);

	const saucerHolesWithBalls = useMemo(() => {
		return filterUndefined(
			kickersWithBallsSwitchIds.map((saucerHolesWithBallsSwitchId) =>
				kickerSwitches.find((kickerSwitch) => kickerSwitch.id === saucerHolesWithBallsSwitchId)
			)
		).map(targetSwitchInfoToTargetSwitch);
	}, [kickersWithBallsSwitchIds, targetSwitchInfoToTargetSwitch]);

	// Clear ball ejecting state when plunger rollover is hit.
	useSwitch(
		() => {
			if (ballEjecting) {
				setBallEjecting(false);
				audio.play({ name: 'rev' });
			}
		},
		[audio, ballEjecting],
		plungerRolloverSwitch
	);

	// Keep track of balls in holes.
	useToggleSwitches(
		({ closed, switchInfo }) => {
			const { id } = switchInfo;
			setKickersWithBallsSwitchIds((saucerHolesWithBalls) => {
				if (closed) {
					if (saucerHolesWithBalls.includes(id)) {
						return saucerHolesWithBalls;
					}
					return [...saucerHolesWithBalls, id];
				} else {
					return saucerHolesWithBalls.filter((n) => n !== id);
				}
			});
		},
		[],
		kickerSwitches
	);

	// Keep track of balls in trough.
	useToggleSwitches(
		({ closed, switchInfo }) => {
			const { id } = switchInfo;
			setTroughSlotsWithBallsSwitchIds((troughSlotsWithBalls) => {
				if (closed) {
					if (troughSlotsWithBalls.includes(id)) {
						return troughSlotsWithBalls;
					}
					return [...troughSlotsWithBalls, id];
				} else {
					return troughSlotsWithBalls.filter((n) => n !== id);
				}
			});
		},
		[],
		troughSwitches
	);

	// Keep our balls in play count updated.
	// Uses a 1 second delay to avoid the count changing in these scenarios:
	//  While balls are rolling down the trough and toggling switches on/off.
	// Also never updates the count while a ball is ejecting.
	useEffect(() => {
		if (!ballEjecting) {
			const timeout = setTimeout(() => {
				const currentBallsInPlay = totalBallsInMachine - troughSlotsWithBallsSwitchIds.length;
				if (currentBallsInPlay !== ballsInPlay) {
					setBallsInPlay(currentBallsInPlay);
				}
			}, 1000);
			return () => clearTimeout(timeout);
		}
	}, [ballEjecting, ballsInPlay, troughSlotsWithBallsSwitchIds.length]);

	// Clear ball ejecting state if it lasts longer than 3 seconds.
	// This happens if the ball fails to eject.
	// If jam switch is open (ball present), the next eject will possibly launch both balls.
	// Since we count the jam switch as a ball in the trough, our count should still be accurate,
	//  but the player will get a free multiball - I guess this is okay, a gift for machine failure?
	// REVIEW: We could add logic to disable everything and require player to just plung + drain the balls
	//  until the jam is cleared, without it impacting scores or game state in any way.
	//  Or maybe game pauses until tech support clears the condition manually - could stuff break?
	useEffect(() => {
		if (ballEjecting) {
			const timeout = setTimeout(() => {
				setBallEjecting(false);
				audio.play({ name: 'crash' });

				// ANALYTICS: This would be a good data point to track, to know when maintenance is needed.
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [audio, ballEjecting]);

	const ejectBall = useCallback(() => {
		// Only allow ball eject if not already ejecting, and we have a ball in slot one.
		if (!ballEjecting && troughSlotsWithBallsSwitchIds.includes(troughBallOneSwitch.id)) {
			hardware.ejectBall();
			audio.play({ name: 'shot' });
			setBallEjecting(true);
		}
	}, [audio, ballEjecting, hardware, troughSlotsWithBallsSwitchIds]);

	const context: Game = useMemo(
		() => ({
			saucerHolesWithBalls,
			modes: modes.map(modeInfoToMode),
			ballsInPlay,
			currentModeStep,
			currentModeIndex,
			get currentMode() {
				return currentMode;
			},
			set currentMode(mode) {
				setCurrentModeIndex(this.modes.indexOf(mode));
			},
			players,
			get currentPlayer() {
				return currentPlayer;
			},
			set currentPlayer(player) {
				setCurrentPlayerIndex(players.indexOf(player));
			},
			nextPlayer,
			shots,
			addShot,
			get videoPlaying() {
				return videoPlaying;
			},
			set videoPlaying(video: string) {
				setVideoPlaying(video);
			},
			ejectBall,
			ballEjecting,
		}),
		[
			saucerHolesWithBalls,
			modeInfoToMode,
			ballsInPlay,
			currentModeStep,
			currentModeIndex,
			players,
			nextPlayer,
			shots,
			addShot,
			currentMode,
			currentPlayer,
			videoPlaying,
			ejectBall,
			ballEjecting,
		]
	);

	return <GameContext.Provider value={context}>{children}</GameContext.Provider>;
};

export default GameContext;
