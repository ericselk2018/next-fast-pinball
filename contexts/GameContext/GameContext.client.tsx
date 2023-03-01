import modes, { ModeInfo, ModeStepInfo, ModeStepTaskInfo } from '@/const/Modes/Modes';
import { startingBallsPerPlayer } from '@/const/Rules/Rules';
import { inlaneSwitch } from '@/const/Switches/Switches';
import Game from '@/entities/Game';
import Mode from '@/entities/Mode';
import ModeStep from '@/entities/ModeStep';
import ModeStepTask from '@/entities/ModeStepTask';
import Player from '@/entities/Player';
import Shot from '@/entities/Shot';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import HardwareContext from '../HardwareContext/HardwareContext';

interface CompletedTask {
	mode: string;
	step: string;
	switch: number;
}

const GameContext = createContext<Game>(null!);

export const GameContextProvider = ({ children, playerCount }: { children: ReactNode; playerCount: number }) => {
	const hardware = useContext(HardwareContext);
	const { switchInfoToSwitch } = hardware;
	const [scores, setScores] = useState(Array(playerCount).fill(0));
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

	const modeStepTaskInfoToModeStepTask = (modeStepTaskInfo: ModeStepTaskInfo): ModeStepTask => {
		const { switches, count } = modeStepTaskInfo;
		return {
			count: count || 1,
			switches: switches.map(switchInfoToSwitch),
		};
	};

	const modeStepInfoToModeStep = (modeStepInfo: ModeStepInfo): ModeStep => {
		const { name, tasks } = modeStepInfo;
		return {
			name,
			tasks: tasks.map(modeStepTaskInfoToModeStepTask),
		};
	};

	const modeInfoToMode = (modeInfo: ModeInfo): Mode => {
		const { name, steps, video } = modeInfo;
		return {
			name,
			video,
			steps: steps.map(modeStepInfoToModeStep),
		};
	};

	const currentMode = modeInfoToMode(modes[currentModeIndex]);

	const players: Player[] = initials.map(
		(initials, index): Player => ({
			initials,
			totalBalls: totalBalls[index],
			usedBalls: usedBalls[index],
			get ballsRemaining() {
				return this.totalBalls - this.usedBalls;
			},
			hasCompletedMode: ({ mode }: { mode: Mode }) => modesCompleted[index].includes(mode.name),
			score: scores[index],
		})
	);

	const currentPlayer = players[currentPlayerIndex];
	const nextPlayer = players[currentPlayerIndex + 1 === players.length ? 0 : currentPlayerIndex + 1];

	const context: Game = useMemo(
		() => ({
			ballsInPlay,
			currentMode,
			players,
			currentPlayer,
			nextPlayer,
			shots,
			get videoPlaying() {
				return videoPlaying;
			},
			set videoPlaying(video: string) {
				setVideoPlaying(video);
			},
		}),
		[ballsInPlay, currentMode, currentPlayer, nextPlayer, players, shots, videoPlaying]
	);

	return <GameContext.Provider value={context}>{children}</GameContext.Provider>;
};

export default GameContext;
