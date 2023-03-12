import { CoilInfo, leftBumperCoil, middleBumperCoil, rightBumperCoil } from 'const/Coils/Coils';
import { leftBumperSwitch, middleBumperSwitch, rightBumperSwitch, SwitchInfo } from 'const/Switches/Switches';

export interface BumperInfo {
	readonly coil: CoilInfo;
	readonly switchInfo: SwitchInfo;
}

export const leftBumper: BumperInfo = {
	coil: leftBumperCoil,
	switchInfo: leftBumperSwitch,
};

export const middleBumper: BumperInfo = {
	coil: middleBumperCoil,
	switchInfo: middleBumperSwitch,
};

export const rightBumper: BumperInfo = {
	coil: rightBumperCoil,
	switchInfo: rightBumperSwitch,
};

export const bumpers: BumperInfo[] = [leftBumper, middleBumper, rightBumper];
