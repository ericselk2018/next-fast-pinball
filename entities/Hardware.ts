import { SwitchInfo } from '@/const/Switches/Switches';
import Flipper from './Flipper';
import Kicker from './Kicker';
import Light from './Light';
import Switch from './Switch';

export default interface Hardware {
	readonly switches: ReadonlyArray<Switch>;
	readonly kickers: ReadonlyArray<Kicker>;
	readonly flippers: ReadonlyArray<Flipper>;
	readonly lights: ReadonlyArray<Light>;
	readonly switchInfoToSwitch: (switchInfo: SwitchInfo) => Switch;
}
