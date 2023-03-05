import Mode from './Mode';
import ModeStep from './ModeStep';
import Player from './Player';
import Shot from './Shot';
import TargetSwitch from './TargetSwitch';

export default interface Game {
	readonly players: ReadonlyArray<Player>;
	currentPlayer: Player;
	readonly nextPlayer: Player;
	readonly ballsInPlay: number;
	readonly setBallsInPlay: (setter: (previousValue: number) => number) => void;
	currentMode: Mode;
	readonly currentModeStep: ModeStep | undefined;
	readonly currentModeIndex: number;
	readonly shots: ReadonlyArray<Shot>;
	addShot: (shot: Shot) => void;
	videoPlaying: string;
	readonly modes: ReadonlyArray<Mode>;
	readonly saucerHolesWithBalls: ReadonlyArray<TargetSwitch>;
}
