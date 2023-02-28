export default class Switch {
	private _number: number;
	private _name: string;
	private _open?: boolean;

	constructor(args: { number: number; name: string } | { switch: Switch; open: boolean }) {
		if ('switch' in args) {
			const { switch: s, open } = args;
			const { number, name } = s;
			this._number = number;
			this._name = name;
			this._open = open;
		} else {
			const { number, name } = args;
			this._number = number;
			this._name = name;
		}
	}

	public get number() {
		return this._number;
	}

	public get name() {
		return this._name;
	}

	public get open() {
		return this._open;
	}
}
