import ModeTask from '../ModeTask/ModeTask';

export default class ModeStep {
	private _name;
	private _tasks: ModeTask[];

	constructor(args: { name: string; tasks: ModeTask[] }) {
		const { name, tasks } = args;
		this._name = name;
		this._tasks = tasks;
	}

	public get name() {
		return this._name;
	}
}
