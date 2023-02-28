import Switch from '../Switch/Switch';

export default class Flipper {
	private _buttonSwitch: Switch;
	private _endOfStrokeSwitch: Switch;

	constructor(args: { buttonSwitch: Switch; endOfStrokeSwitch: Switch }) {
		const { buttonSwitch, endOfStrokeSwitch } = args;
		this._buttonSwitch = buttonSwitch;
		this._endOfStrokeSwitch = endOfStrokeSwitch;
	}

	public get buttonSwitch() {
		return this._buttonSwitch;
	}

	public get endOfStrokeSwitch() {
		return this._endOfStrokeSwitch;
	}
}
