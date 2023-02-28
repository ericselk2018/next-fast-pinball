import ModeStep from '../ModeStep/ModeStep';

export default class Mode {
	private _name = '';
	private _steps: ModeStep[] = [];
	private _video = '';

	constructor(args: { name: string; steps: ModeStep[]; video: string }) {
		const { name, steps, video } = args;
		this._name = name;
		this._steps = steps;
		this._video = video;
	}

	public get name() {
		return this._name;
	}

	public get steps() {
		return this._steps;
	}

	public get video() {
		return this._video;
	}
}
