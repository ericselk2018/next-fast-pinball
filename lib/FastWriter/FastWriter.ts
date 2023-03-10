import { filterUndefined } from '../array/array';
import { clamp } from '../math/math';

const FastWriter = (args: { write: (text: string) => Promise<void> }) => {
	const { write } = args;

	// Zero padding and uppercase doesn't seem to be needed,
	//  but it makes things match the docs and maybe easier to read in logs.
	const toHex = (number: number) => {
		const hex = number.toString(16).toUpperCase();
		if (hex.length % 2) {
			return '0' + hex;
		}
		return hex;
	};

	const percentToByteValue = (value: number) => Math.round(clamp({ value, min: 0, max: 1 }) * 255);

	const writeLine = async (args: { text: string }) => {
		const { text } = args;
		await write(text + '\r');
	};

	const writeCommand = async (command: string, ...args: Array<number | undefined>) => {
		const text = `${command}:${filterUndefined(args)
			.map((arg) => toHex(arg))
			.join(',')}`;
		await writeLine({ text });
	};

	const clear = async () => {
		await writeLine({ text: Array(2048).fill(' ').join('') });
	};

	const configureHardware = async (args: { hardwareModel: number }) => {
		const { hardwareModel } = args;
		await writeCommand('CH', hardwareModel, 1);
	};

	const getSwitchStates = async () => {
		await writeCommand('SA');
	};

	const setWatchdog = async (args: { timeoutInMilliseconds: number }) => {
		const { timeoutInMilliseconds } = args;
		await writeCommand('WD', timeoutInMilliseconds);
	};

	const coil = (() => {
		const triggerFlags = {
			enable: 0b1,
			notUsed1: 0b10,
			notUsed2: 0b100,
			oneShot: 0b1000,
			invertSwitchOne: 0b10000,
			invertSwitchTwo: 0b100000,
			manual: 0b1000000,
			disableSwitch: 0b10000000,
		};
		const modes = {
			pulse: 0x10,
			pulseAndHold: 0x18,
			pulseWithCancelSwitch: 0x75,
		};

		const configureAutoTriggeredDiverter = async (args: {
			coilId: number;
			enterSwitchId: number;
			exitSwitchId: number;
			trigger: { enterSwitchCondition: boolean; exitSwitchCondition: boolean };
			fullPowerTimeInMilliseconds: number;
			partialPowerTimeInDeciseconds: number;
			partialPowerPercent: number;
			restTimeInMilliseconds: number;
		}) => {
			const {
				coilId,
				enterSwitchId,
				exitSwitchId,
				trigger,
				fullPowerTimeInMilliseconds,
				partialPowerTimeInDeciseconds,
				partialPowerPercent,
				restTimeInMilliseconds,
			} = args;
			const { enterSwitchCondition, exitSwitchCondition } = trigger;
			const triggerValue =
				triggerFlags.enable |
				(enterSwitchCondition ? 0 : triggerFlags.invertSwitchOne) |
				(exitSwitchCondition ? 0 : triggerFlags.invertSwitchTwo);
			const coilMode = modes.pulseWithCancelSwitch;
			await writeCommand(
				'DL',
				coilId,
				triggerValue,
				enterSwitchId,
				coilMode,
				exitSwitchId,
				fullPowerTimeInMilliseconds,
				partialPowerTimeInDeciseconds,
				percentToByteValue(partialPowerPercent),
				restTimeInMilliseconds
			);
		};

		const latch = async (args: {
			coilId: number;
			switchCondition: boolean;
			switchId: number;
			kickTimeInMilliseconds: number;
			kickPowerPercent: number;
			latchPowerPercent: number;
			restTimeInMilliseconds: number;
		}) => {
			const {
				coilId,
				kickPowerPercent,
				kickTimeInMilliseconds,
				latchPowerPercent,
				switchCondition,
				switchId,
				restTimeInMilliseconds,
			} = args;
			const triggerValue = triggerFlags.enable | (switchCondition ? 0 : triggerFlags.invertSwitchOne);
			const coilMode = modes.pulseAndHold;
			await writeCommand(
				'DL',
				coilId,
				triggerValue,
				switchId,
				coilMode,
				kickTimeInMilliseconds,
				percentToByteValue(kickPowerPercent),
				percentToByteValue(latchPowerPercent),
				restTimeInMilliseconds,
				0 // Says <NA> in docs, seems to work fine without sending this also, MPF sends 0 - maybe for legacy Nano reasons
			);
		};

		const modifyTrigger = async (args: {
			coilId: number;
			control: 'auto' | 'tap' | 'off' | 'on';
			switchId?: number;
		}) => {
			const { coilId, control, switchId } = args;
			const controlValue = control === 'auto' ? 0 : control === 'tap' ? 1 : control === 'off' ? 2 : /*on*/ 3;
			await writeCommand('TL', coilId, controlValue, switchId);
		};

		const configurePulse = async (args: {
			coilId: number;
			switchId?: number;
			switchCondition?: boolean;
			pulsePowerPercent: number;
			pulseTimeInMilliseconds: number;
			restTimeInMilliseconds: number;
		}) => {
			const {
				coilId,
				pulsePowerPercent,
				pulseTimeInMilliseconds,
				restTimeInMilliseconds,
				switchCondition,
				switchId,
			} = args;
			const coilMode = modes.pulse;
			const triggerValue =
				triggerFlags.enable |
				(switchId === undefined
					? triggerFlags.disableSwitch
					: switchCondition
					? 0
					: triggerFlags.invertSwitchOne);
			await writeCommand(
				'DL',
				coilId,
				triggerValue,
				switchId || 0,
				coilMode,
				pulseTimeInMilliseconds,
				percentToByteValue(pulsePowerPercent),
				0,
				0,
				restTimeInMilliseconds
			);
		};

		return {
			configureAutoTriggeredDiverter,
			latch,
			modifyTrigger,
			configurePulse,
		};
	})();

	return {
		clear,
		configureHardware,
		getSwitchStates,
		setWatchdog,
		coil,
	};
};

export default FastWriter;
