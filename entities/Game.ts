import { CompletedTask } from 'contexts/GameContext/GameContext.client';
import Mode from './Mode';
import ModeStep from './ModeStep';
import Player from './Player';
import Shot from './Shot';
import TargetSwitch from './TargetSwitch';

export default interface Game {
	readonly players: ReadonlyArray<Player>;
	currentPlayer: Player;
	readonly nextPlayer: Player;
	currentMode: Mode;
	readonly currentModeStep: ModeStep | undefined;
	readonly modeComplete: boolean;
	readonly currentModeIndex: number;
	readonly shots: ReadonlyArray<Shot>;
	addShot: (shot: Shot) => void;
	videoPlaying: string;
	readonly modes: ReadonlyArray<Mode>;
	readonly kickersWithBalls: ReadonlyArray<TargetSwitch>;
	readonly waitingForLaunch: boolean;
	readonly tasksCompleted: ReadonlyArray<CompletedTask>;
}
