import { SwitchInfo, TargetSwitchInfo } from '../const/Switches/Switches';
import Switch from './Switch';
import TargetSwitch from './TargetSwitch';

export default interface Hardware {
	readonly switchInfoToSwitch: (switchInfo: SwitchInfo) => Switch;
	readonly targetSwitchInfoToTargetSwitch: (targetSwitchInfo: TargetSwitchInfo) => TargetSwitch;
	readonly enableFlippers: () => void;
	readonly disableFlippers: () => void;
	readonly addSwitchHandler: (args: {
		switches: ReadonlyArray<SwitchInfo>;
		onHit?: (switchInfo: SwitchInfo) => void;
		onToggle?: (args: { switchInfo: SwitchInfo; closed: boolean }) => void;
	}) => () => void;
}
