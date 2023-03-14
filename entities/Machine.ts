import { EventSource } from '../lib/event/event';

export default interface Machine {
	credits: number;
	readonly startGame: () => void;
	readonly gameStartEvent: EventSource;
	readonly ballsInPlay: number;
}
