import Mode from '../Mode/Mode';
import allModes from '../../const/Modes/Modes';

export default class Player {
	score = 0;
	ballsRemaining = 0;
	ballsUsed = 0;
	modes: Mode[] = allModes;
}
