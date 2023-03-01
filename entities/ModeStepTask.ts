import Switch from './Switch';

export default interface ModeStepTask {
	readonly switches: ReadonlyArray<Switch>;
	readonly count: number;
	readonly completedSwitches: ReadonlyArray<Switch>;
	completeSwitch: (args: { switch: Switch }) => void;
}
