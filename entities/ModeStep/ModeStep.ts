export default class ModeStep {
	private _name = '';
	private _complete?: boolean;

	constructor(args: { name: string }) {
		const { name } = args;
		this._name = name;
	}

	public get name() {
		return this._name;
	}

	public get complete() {
		return !!this._complete;
	}
}
