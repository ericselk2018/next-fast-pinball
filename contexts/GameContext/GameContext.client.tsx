import modes, { ModeInfo, ModeStepInfo } from '@/const/Modes/Modes';
import { startingBallsPerPlayer, startingScore } from '@/const/Rules/Rules';
import { inlaneSwitch } from '@/const/Switches/Switches';
import Game from '@/entities/Game';
import Mode from '@/entities/Mode';
import ModeStep from '@/entities/ModeStep';
import Player from '@/entities/Player';
import Shot from '@/entities/Shot';
import { replaceItemAtIndex } from '@/lib/array/array';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import HardwareContext from '../HardwareContext/HardwareContext';

interface CompletedTask {
	mode: string;
	step: string;
	switch: number;
}

const GameContext = createContext<Game>(null!);

export const GameContextProvider = ({ children, playerCount }: { children: ReactNode; playerCount: number }) => {
	const hardware = useContext(HardwareContext);
	const { switchInfoToSwitch, targetSwitchInfoToTargetSwitch } = hardware;
	const [scores, setScores] = useState(Array(playerCount).fill(startingScore));
	const [totalBalls, setTotalBalls] = useState(Array(playerCount).fill(startingBallsPerPlayer));
	const [usedBalls, setUsedBalls] = useState(Array(playerCount).fill(0));
	const [initials, setInitials] = useState(Array(playerCount).fill(''));
	const [modesCompleted, setModesCompleted] = useState<string[][]>(Array(playerCount).fill([]));
	const [currentModeIndex, setCurrentModeIndex] = useState(0);
	const [tasksCompleted, setTasksCompleted] = useState<CompletedTask[]>([]);
	const [shots, setShots] = useState<Shot[]>([]);
	const [videoPlaying, setVideoPlaying] = useState('');
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
	const [saucerHolesWithBalls, setSaucerHolesWithBalls] = useState<number[]>([]);
	const [ballsInPlay, setBallsInPlay] = useState(0);

	const inlane = hardware.switches.find((aSwitch) => aSwitch.number === inlaneSwitch.number);

	useEffect(() => {
		if (inlane) {
			return inlane.addHitHandler({
				onHit: () => {
					setBallsInPlay((ballsInPlay) => ballsInPlay + 1);
				},
			});
		}
	}, [inlane]);

	const modeStepInfoToModeStep = useCallback(
		(modeStepInfo: ModeStepInfo, modeInfo: ModeInfo): ModeStep => {
			const { name, switches, count } = modeStepInfo;
			return {
				name,
				count: count || 1,
				switches: switches.map(targetSwitchInfoToTargetSwitch),
				completedSwitches: switches
					.filter((aSwitch) =>
						tasksCompleted.some(
							(task) =>
								task.mode === modeInfo.name &&
								task.step === modeStepInfo.name &&
								task.switch === aSwitch.number
						)
					)
					.map(targetSwitchInfoToTargetSwitch),
				completeSwitch: (args) =>
					setTasksCompleted((tasksCompleted) => [
						...tasksCompleted,
						{ mode: modeInfo.name, step: modeStepInfo.name, switch: args.switch.number },
					]),
			};
		},
		[switchInfoToSwitch, tasksCompleted]
	);

	const modeInfoToMode = useCallback(
		(modeInfo: ModeInfo): Mode => {
			const { name, steps, video } = modeInfo;
			return {
				name,
				video,
				steps: steps.map((step) => modeStepInfoToModeStep(step, modeInfo)),
			};
		},
		[modeStepInfoToModeStep]
	);

	const currentMode = modeInfoToMode(modes[currentModeIndex]);

	const players: Player[] = initials.map(
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

	const context: Game = useMemo(
		() => ({
			modes: modes.map(modeInfoToMode),
			get ballsInPlay() {
				return ballsInPlay;
			},
			set ballsInPlay(value) {
				setBallsInPlay(value);
			},
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
		[addShot, ballsInPlay, currentMode, currentPlayer, modeInfoToMode, nextPlayer, players, shots, videoPlaying]
	);

	return <GameContext.Provider value={context}>{children}</GameContext.Provider>;
};

export default GameContext;
