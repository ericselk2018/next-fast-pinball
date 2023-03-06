import { CoilInfo, leftKickerCoil } from 'const/Coils/Coils';
import { leftKickerSwitch, SwitchInfo } from 'const/Switches/Switches';

export interface KickerInfo {
	readonly coil: CoilInfo;
	readonly switchInfo: SwitchInfo;
}

export const leftKicker: KickerInfo = {
	coil: leftKickerCoil,
	switchInfo: leftKickerSwitch,
};

export const kickers: KickerInfo[] = [leftKicker];
