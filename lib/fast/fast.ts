import { filterUndefined } from '../array/array';
import { clamp } from '../math/math';

export const fast = (args: { write: (text: string) => Promise<void> }) => {
	const { write } = args;

	const toHex = (number: number) => number.toString(16);

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

	const driver = (() => {
		const configureAutoTriggeredDiverter = async (args: {
			driverId: number;
			enterSwitchId: number;
			exitSwitchId: number;
			trigger: { enterSwitchCondition: boolean; exitSwitchCondition: boolean };
			fullPowerTimeInMilliseconds: number;
			partialPowerTimeInDeciseconds: number;
			partialPowerPercent: number;
			restTimeInMilliseconds: number;
		}) => {
			const {
				driverId,
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
				enterSwitchCondition && exitSwitchCondition
					? 0x01
					: !enterSwitchCondition && exitSwitchCondition
					? 0x11
					: enterSwitchCondition && !exitSwitchCondition
					? 0x21
					: // !enterSwitchCondition && !exitSwitchCondition
					  0x31;
			const partialPowerValue = clamp({ value: partialPowerPercent, min: 0, max: 1 }) * 255;

			const driverMode = 0x75;
			await writeCommand(
				'DL',
				driverId,
				triggerValue,
				enterSwitchId,
				driverMode,
				exitSwitchId,
				fullPowerTimeInMilliseconds,
				partialPowerTimeInDeciseconds,
				partialPowerValue,
				restTimeInMilliseconds
			);
		};

		const latch = async (args: {
			driverId: number;
			switchCondition: boolean;
			switchId: number;
			kickTimeInMilliseconds: number;
			kickPowerPercent: number;
			latchPowerPercent: number;
			restTimeInMilliseconds: number;
		}) => {
			const {
				driverId,
				kickPowerPercent,
				kickTimeInMilliseconds,
				latchPowerPercent,
				switchCondition,
				switchId,
				restTimeInMilliseconds,
			} = args;
			const triggerValue = switchCondition ? 0x01 : 0x11;
			const driverMode = 0x18;
			await writeCommand(
				'DL',
				driverId,
				triggerValue,
				switchId,
				driverMode,
				kickTimeInMilliseconds,
				kickPowerPercent,
				latchPowerPercent,
				restTimeInMilliseconds
			);
		};

		const modifyTrigger = async (args: {
			driverId: number;
			control: 'auto' | 'tap' | 'off' | 'on';
			switchId?: number;
		}) => {
			const { driverId, control, switchId } = args;
			const controlValue = control === 'auto' ? 0 : control === 'tap' ? 1 : control === 'off' ? 2 : /*on*/ 3;
			await writeCommand('TL', driverId, controlValue, switchId);
		};

		return {
			configureAutoTriggeredDiverter,
			latch,
			modifyTrigger,
		};
	})();

	return {
		clear,
		configureHardware,
		getSwitchStates,
		setWatchdog,
		driver,
	};
};
