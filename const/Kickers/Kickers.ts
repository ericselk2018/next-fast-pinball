import { CoilInfo, leftKickerCoil, middleKickerCoil, rightKickerCoil, topKickerCoil } from 'const/Coils/Coils';
import {
	leftKickerSwitch,
	middleKickerSwitch,
	rightKickerSwitch,
	SwitchInfo,
	topKickerSwitch,
} from 'const/Switches/Switches';

export interface KickerInfo {
	readonly coil: CoilInfo;
	readonly switchInfo: SwitchInfo;
}

export const leftKicker: KickerInfo = {
	coil: leftKickerCoil,
	switchInfo: leftKickerSwitch,
};

export const topKicker: KickerInfo = {
	coil: topKickerCoil,
	switchInfo: topKickerSwitch,
};

export const middleKicker: KickerInfo = {
	coil: middleKickerCoil,
	switchInfo: middleKickerSwitch,
};

export const rightKicker: KickerInfo = {
	coil: rightKickerCoil,
	switchInfo: rightKickerSwitch,
};

export const kickers: KickerInfo[] = [leftKicker, topKicker, middleKicker, rightKicker];
