import Switch from '../Switch/Switch';

export default class ModeTask {
	private _switches: Switch[];
	private _count = 1;

	constructor(args: { switches: Switch[]; count?: number }) {
		const { switches, count } = args;
		this._switches = switches;
		if (count) {
			this._count = count;
		}
	}

	public get switches() {
		return this._switches;
	}
}
