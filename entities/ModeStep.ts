import TargetSwitch from './TargetSwitch';

export default interface ModeStep {
	readonly name: string;
	readonly switches: ReadonlyArray<TargetSwitch>;
	readonly count: number;
	readonly completedSwitches: ReadonlyArray<TargetSwitch>;
	completeSwitch: (args: { switch: TargetSwitch }) => void;
}
