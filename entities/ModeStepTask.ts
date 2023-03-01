import Switch from './Switch';

export default interface ModeStepTask {
	readonly switches: ReadonlyArray<Switch>;
	readonly count: number;
}
