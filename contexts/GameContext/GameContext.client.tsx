import modes, { ModeInfo, ModeStepInfo } from '@/const/Modes/Modes';
import { startingBallsPerPlayer, startingScore } from '@/const/Rules/Rules';
import { kickerSwitches } from '@/const/Switches/Switches';
import Game from '@/entities/Game';
import Mode from '@/entities/Mode';
import ModeStep from '@/entities/ModeStep';
import Player from '@/entities/Player';
import Shot from '@/entities/Shot';
import { filterUndefined, replaceItemAtIndex } from '@/lib/array/array';
import { useToggleSwitches } from '@/lib/switch/switch';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import HardwareContext from '../HardwareContext/HardwareContext';

interface CompletedTask {
	step: string;
	switch: number;
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
	const { targetSwitchInfoToTargetSwitch } = hardware;
	const [scores, setScores] = useState(Array(playerInitials.length).fill(startingScore));
	const [totalBalls, setTotalBalls] = useState(Array(playerInitials.length).fill(startingBallsPerPlayer));
	const [usedBalls, setUsedBalls] = useState(Array(playerInitials.length).fill(0));
	const [modesCompleted, setModesCompleted] = useState<string[][]>(Array(playerInitials.length).fill([]));
	const [currentModeIndex, setCurrentModeIndex] = useState(0);
	const [tasksCompleted, setTasksCompleted] = useState<CompletedTask[]>([]);
	const [shots, setShots] = useState<Shot[]>([]);
	const [videoPlaying, setVideoPlaying] = useState('');
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
	const [saucerHolesWithBallsSwitchNumbers, setSaucerHolesWithBallsSwitchNumbers] = useState<number[]>([]);
	const [ballsInPlay, setBallsInPlay] = useState(0);

	const modeStepInfoToModeStep = useCallback(
		(modeStepInfo: ModeStepInfo): ModeStep => {
			const { name, switches, count } = modeStepInfo;
			return {
				name,
				count: count || 1,
				switches: switches.map(targetSwitchInfoToTargetSwitch),
				completedSwitches: switches
					.filter((aSwitch) =>
						tasksCompleted.some((task) => task.step === modeStepInfo.name && task.switch === aSwitch.number)
					)
					.map(targetSwitchInfoToTargetSwitch),
				incompleteSwitches: switches
					.filter(
						(aSwitch) =>
							!tasksCompleted.some(
								(task) => task.step === modeStepInfo.name && task.switch === aSwitch.number
							)
					)
					.map(targetSwitchInfoToTargetSwitch),
				completeSwitch: (args) =>
					setTasksCompleted((tasksCompleted) => [
						...tasksCompleted,
						{ step: modeStepInfo.name, switch: args.switch.number },
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

	const players: Player[] = playerInitials.map(
		(initials, index): Player => ({
			number: index + 1,
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
			saucerHolesWithBallsSwitchNumbers.map((saucerHolesWithBallsSwitchNumber) =>
				kickerSwitches.find((kickerSwitch) => kickerSwitch.number === saucerHolesWithBallsSwitchNumber)
			)
		).map(targetSwitchInfoToTargetSwitch);
	}, [saucerHolesWithBallsSwitchNumbers, targetSwitchInfoToTargetSwitch]);

	const context: Game = useMemo(
		() => ({
			saucerHolesWithBalls,
			modes: modes.map(modeInfoToMode),
			ballsInPlay,
			setBallsInPlay,
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
		}),
		[
			addShot,
			ballsInPlay,
			currentMode,
			currentModeStep,
			currentModeIndex,
			currentPlayer,
			modeInfoToMode,
			nextPlayer,
			players,
			shots,
			videoPlaying,
			saucerHolesWithBalls,
		]
	);

	// Keep track of balls in holes.
	useToggleSwitches(
		({ closed, switchInfo }) => {
			const { number } = switchInfo;
			setSaucerHolesWithBallsSwitchNumbers((saucerHolesWithBalls) => {
				if (closed) {
					if (saucerHolesWithBalls.includes(number)) {
						return saucerHolesWithBalls;
					}
					return [...saucerHolesWithBalls, number];
				} else {
					return saucerHolesWithBalls.filter((n) => n !== number);
				}
			});
		},
		[],
		kickerSwitches
	);

	return <GameContext.Provider value={context}>{children}</GameContext.Provider>;
};

export default GameContext;
