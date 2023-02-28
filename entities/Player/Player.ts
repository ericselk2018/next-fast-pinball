export default class Player {
	private _score = 0;
	private _ballsRemaining = 0;
	private _ballsUsed = 0;
	private _modesCompleted: string[] = [];
	private _update: (player: Player) => void;

	constructor(args: { update: (player: Player) => void }) {
		const { update } = args;
		this._update = update;
	}

	public set score(value: number) {
		this._update({ ...this, _score: value });
	}
}
