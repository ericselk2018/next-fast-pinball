import Switch from '../Switch/Switch';

export default class KeyBinding {
	private _key: string;
	private _location?: number;
	private _switch: Switch;

	constructor(args: { key: string; location?: number; switch: Switch }) {
		const { key, location, switch: aSwitch } = args;
		this._key = key;
		this._location = location;
		this._switch = aSwitch;
	}

	public get key() {
		return this._key;
	}

	public get location() {
		return this._location;
	}

	public get switch() {
		return this._switch;
	}
}
