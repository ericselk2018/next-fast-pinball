import { TargetSwitchInfo } from '../const/Switches/Switches';
import Switch from './Switch';

export default interface TargetSwitch extends Switch, TargetSwitchInfo {
	readonly image: string;
	readonly videos: ReadonlyArray<string>;
}
