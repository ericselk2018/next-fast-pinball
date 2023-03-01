import Mode from './Mode';

export default interface Player {
	score: number;
	totalBalls: number;
	usedBalls: number;
	readonly ballsRemaining: number;
	readonly initials: string;
	readonly hasCompletedMode: (args: { mode: Mode }) => boolean;
}
