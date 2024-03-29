import modes, { ModeInfo, ModeStepInfo } from '../../const/Modes/Modes';
import { startingBallsPerPlayer, startingScore } from '../../const/Rules/Rules';
import { kickerSwitches, troughSwitches, SwitchInfo, plungerRolloverSwitch } from '../../const/Switches/Switches';
import Game from '../../entities/Game';
import Mode from '../../entities/Mode';
import ModeStep from '../../entities/ModeStep';
import Player from '../../entities/Player';
import Shot from '../../entities/Shot';
import { filterUndefined, replaceItemAtIndex } from '../../lib/array/array';
import { useToggleSwitches } from '../../lib/switch/switch';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import HardwareContext from '../HardwareContext/HardwareContext';
import AudioContext from 'contexts/AudioContext/AudioContext.client';
import { KickerInfo, kickers } from 'const/Kickers/Kickers';
import { useGameState } from 'lib/state/state';
import MachineContext from 'contexts/MachineContext/MachineContext';

export interface CompletedTask {
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
	const { ballsInPlay } = useContext(MachineContext);
	const hardware = useContext(HardwareContext);
	const audio = useContext(AudioContext);
	const { targetSwitchInfoToTargetSwitch, isSwitchClosed } = hardware;
	const alreadyClosedSwitchIds = ({ switches }: { switches: ReadonlyArray<SwitchInfo> }) =>
		switches.filter((switchInfo) => isSwitchClosed({ switchInfo })).map((switchInfo) => switchInfo.id);
	const [scores, setScores] = useGameState(Array(playerInitials.length).fill(startingScore));
	const [totalBalls, setTotalBalls] = useGameState(Array(playerInitials.length).fill(startingBallsPerPlayer));
	const [usedBalls, setUsedBalls] = useGameState(Array(playerInitials.length).fill(0));
	const [modesCompleted, setModesCompleted] = useGameState<string[][]>(Array(playerInitials.length).fill([]));
	const [currentModeIndex, setCurrentModeIndex] = useGameState(0);
	const [tasksCompleted, setTasksCompleted] = useGameState<CompletedTask[]>([]);
	const [shots, setShots] = useGameState<Shot[]>([]);
	const [videoPlaying, setVideoPlaying] = useGameState('');
	const [currentPlayerIndex, setCurrentPlayerIndex] = useGameState(0);
	const [kickersWithBallsSwitchIds, setKickersWithBallsSwitchIds] = useGameState<number[]>(
		alreadyClosedSwitchIds({ switches: kickerSwitches })
	);
	const [troughSlotsWithBallsSwitchIds, setTroughSlotsWithBallsSwitchIds] = useGameState<number[]>(
		alreadyClosedSwitchIds({ switches: troughSwitches })
	);

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
		};
	}, [kickersWithBallsSwitchIds, troughSlotsWithBallsSwitchIds]);

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
		[setTasksCompleted, targetSwitchInfoToTargetSwitch, tasksCompleted]
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

	const addShot = useCallback(
		(shot: Shot) => {
			setShots((shots) => [...shots, shot]);
		},
		[setShots]
	);

	const kickersWithBalls = useMemo(() => {
		return filterUndefined(
			kickersWithBallsSwitchIds.map((kickerWithBallSwitchId) =>
				kickerSwitches.find((kickerSwitch) => kickerSwitch.id === kickerWithBallSwitchId)
			)
		).map(targetSwitchInfoToTargetSwitch);
	}, [kickersWithBallsSwitchIds, targetSwitchInfoToTargetSwitch]);

	const kickBall = useCallback(
		(args: { kicker: KickerInfo }) => {
			const { kicker } = args;
			hardware.kickBall({ kicker });
		},
		[hardware]
	);

	// Kick all balls out of kickers when no balls in play and all balls are in kickers, or all kickers have balls.
	// Start multi-ball.
	// useEffect(() => {
	// 	if (
	// 		(!ballsInPlay && kickersWithBalls.length === kickerSwitches.length) ||
	// 		kickersWithBalls.length === totalBallsInMachine
	// 	) {
	// 		kickersWithBalls.forEach((kickersWithBall) => {
	// 			const kicker = kickers.find((kicker) => kicker.switchInfo.id === kickersWithBall.id);
	// 			if (kicker) {
	// 				kickBall({ kicker });
	// 			}
	// 		});
	// 	}
	// }, [ballsInPlay, kickBall, kickersWithBalls]);

	// Apply logic when balls enter or exit kickers.
	useToggleSwitches(
		({ closed: hasBall, switchInfo }) => {
			const { id } = switchInfo;
			setKickersWithBallsSwitchIds((kickersWithBallsSwitchIds) => {
				const hadBall = kickersWithBallsSwitchIds.includes(id);
				const isTarget = !!currentModeStep?.switches.some((switchInfo) => switchInfo.id === id);

				// If the state did not actually change, ignore the toggle.
				if (hasBall === hadBall) {
					return kickersWithBallsSwitchIds;
				}

				// If a balls go in a hole that isn't a target, we just kick it out.
				if (hasBall && !isTarget) {
					const kicker = kickers.find((kicker) => kicker.switchInfo.id === id);
					if (kicker) {
						audio.play({ name: 'crash' });
						setTimeout(() => {
							kickBall({ kicker });
						}, 1000);
					}
					return kickersWithBallsSwitchIds;
				}

				// If a ball went in a target, it will be held, add to list.
				if (hasBall && isTarget) {
					return [...kickersWithBallsSwitchIds, id];
				}

				// If we get here, the ball left the kicker, remove from list.
				return kickersWithBallsSwitchIds.filter((n) => n !== id);
			});
		},
		[audio, currentModeStep?.switches, kickBall, setKickersWithBallsSwitchIds],
		kickerSwitches
	);

	// Update balls in play value whenever balls enter or exit kickers.
	// useEffectWithPreviousValue(
	// 	(previousKickersWithBallsSwitchIdsLength) => {
	// 		const difference = kickersWithBallsSwitchIds.length - previousKickersWithBallsSwitchIdsLength;
	// 		if (difference) {
	// 			setBallsInPlay((ballsInPlay) => {
	// 				console.log(
	// 					`balls in holes changed by ${difference}, setting balls in play to ${ballsInPlay - difference}`
	// 				);
	// 				return ballsInPlay - difference;
	// 			});
	// 		}
	// 	},
	// 	[kickersWithBallsSwitchIds.length, setBallsInPlay],
	// 	kickersWithBallsSwitchIds.length
	// );

	// Keep track of balls in trough.
	// REVIEW: Currently we only actually care about ball slot one, so we should just track that if nothing else used.
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
		[setTroughSlotsWithBallsSwitchIds],
		troughSwitches
	);

	const modeComplete = useMemo(() => {
		return !!ballsInPlay && !currentModeStep;
	}, [ballsInPlay, currentModeStep]);

	// Clear completed tasks anytime no balls are in play, unless disabled by rule and we haven't completed all steps.
	// useEffect(() => {
	// 	if (!ballsInPlay && (clearProgressWhenNoBallsInPlay || !currentModeStep)) {
	// 		setTasksCompleted([]);
	// 	}
	// }, [ballsInPlay, currentModeStep, setTasksCompleted]);

	const waitingForLaunch = useMemo(() => {
		return !ballsInPlay || (ballsInPlay === 1 && isSwitchClosed({ switchInfo: plungerRolloverSwitch }));
	}, [ballsInPlay, isSwitchClosed]);

	const context: Game = useMemo(
		() => ({
			waitingForLaunch,
			kickersWithBalls,
			modes: modes.map(modeInfoToMode),
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
			kickBall,
			modeComplete,
			tasksCompleted,
		}),
		[
			waitingForLaunch,
			kickersWithBalls,
			modeInfoToMode,
			currentModeStep,
			currentModeIndex,
			players,
			nextPlayer,
			shots,
			addShot,
			kickBall,
			modeComplete,
			tasksCompleted,
			currentMode,
			setCurrentModeIndex,
			currentPlayer,
			setCurrentPlayerIndex,
			videoPlaying,
			setVideoPlaying,
		]
	);

	return <GameContext.Provider value={context}>{children}</GameContext.Provider>;
};

export default GameContext;
