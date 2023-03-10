import { CoilInfo, rightBumperCoil } from 'const/Coils/Coils';
import { rightBumperSwitch, SwitchInfo } from 'const/Switches/Switches';

export interface BumperInfo {
	readonly coil: CoilInfo;
	readonly switchInfo: SwitchInfo;
}

export const rightBumper: BumperInfo = {
	coil: rightBumperCoil,
	switchInfo: rightBumperSwitch,
};

export const bumpers: BumperInfo[] = [rightBumper];
