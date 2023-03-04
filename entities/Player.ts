import Mode from './Mode';

export default interface Player {
	readonly number: number;
	score: number;
	totalBalls: number;
	usedBalls: number;
	readonly ballsRemaining: number;
	readonly initials: string;
	readonly hasCompletedMode: (args: { mode: Mode }) => boolean;
	readonly completeMode: (args: { mode: Mode }) => void;
}
