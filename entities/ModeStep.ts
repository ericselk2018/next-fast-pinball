import ModeStepTask from './ModeStepTask';

export default interface ModeStep {
	readonly name: string;
	readonly tasks: ReadonlyArray<ModeStepTask>;
}
