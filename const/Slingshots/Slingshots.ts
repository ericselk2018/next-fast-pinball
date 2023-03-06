import { CoilInfo, leftSlingshotCoil, rightSlingshotCoil } from 'const/Coils/Coils';
import { leftSlingshotSwitch, rightSlingshotSwitch, SwitchInfo } from 'const/Switches/Switches';

export interface SlingshotInfo {
	readonly coil: CoilInfo;
	readonly switchInfo: SwitchInfo;
}

export const leftSlingshot: SlingshotInfo = {
	switchInfo: leftSlingshotSwitch,
	coil: leftSlingshotCoil,
};

export const rightSlingshot: SlingshotInfo = {
	switchInfo: rightSlingshotSwitch,
	coil: rightSlingshotCoil,
};

export const slingshots: ReadonlyArray<SlingshotInfo> = [leftSlingshot, rightSlingshot];
