import { KickerInfo } from 'const/Kickers/Kickers';
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
	currentMode: Mode;
	readonly currentModeStep: ModeStep | undefined;
	readonly modeComplete: boolean;
	readonly currentModeIndex: number;
	readonly shots: ReadonlyArray<Shot>;
	addShot: (shot: Shot) => void;
	videoPlaying: string;
	readonly modes: ReadonlyArray<Mode>;
	readonly saucerHolesWithBalls: ReadonlyArray<TargetSwitch>;
	readonly ejectBall: () => void;
	readonly ballEjecting: boolean;
	readonly kickBall: (args: { kicker: KickerInfo }) => void;
}
