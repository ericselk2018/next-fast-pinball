import Mode from './Mode';
import Player from './Player';
import Shot from './Shot';
import TargetSwitch from './TargetSwitch';

export default interface Game {
	readonly players: ReadonlyArray<Player>;
	currentPlayer: Player;
	readonly nextPlayer: Player;
	ballsInPlay: number;
	currentMode: Mode;
	readonly shots: ReadonlyArray<Shot>;
	addShot: (shot: Shot) => void;
	videoPlaying: string;
	readonly modes: ReadonlyArray<Mode>;
	readonly saucerHolesWithBalls: ReadonlyArray<TargetSwitch>;
}
