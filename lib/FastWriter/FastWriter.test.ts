import FastWriter from './FastWriter';

const toHex = (number: number) => {
	const hex = number.toString(16).toUpperCase();
	if (hex.length % 2) {
		return '0' + hex;
	}
	return hex;
};

describe('FastWriter', () => {
	describe('configureHardware', () => {
		it('should write correct command', async () => {
			const write = jest.fn();
			const hardwareModel = 1234;
			await FastWriter({ write }).configureHardware({ hardwareModel });
			expect(write).toBeCalledTimes(1);
			expect(write).toBeCalledWith(`CH:${toHex(hardwareModel)},01\r`);
		});
	});
	describe('getSwitchStates', () => {
		it('should write correct command', async () => {
			const write = jest.fn();
			await FastWriter({ write }).getSwitchStates();
			expect(write).toBeCalledTimes(1);
			expect(write).toBeCalledWith(`SA:\r`);
		});
	});
	describe('setWatchdog', () => {
		it('should write correct command', async () => {
			const write = jest.fn();
			const timeoutInMilliseconds = 1234;
			await FastWriter({ write }).setWatchdog({ timeoutInMilliseconds });
			expect(write).toBeCalledTimes(1);
			expect(write).toBeCalledWith(`WD:${toHex(timeoutInMilliseconds)}\r`);
		});
	});
	describe('coil', () => {
		describe('configureAutoTriggeredDiverter', () => {
			it('should write correct command', async () => {
				const write = jest.fn();
				const enterSwitch = 123;
				const exitSwitch = 23;
				const fullPowerTimeInMilliseconds = 1234;
				const mainCoil = 234;
				const partialPowerPercent = 0.123;
				const partialPowerTimeInDeciseconds = 34;
				const restTimeInMilliseconds = 56;
				const trigger = { enterSwitchCondition: true, exitSwitchCondition: false };
				const triggerValue = 0x21;
				await FastWriter({ write }).coil.configureAutoTriggeredDiverter({
					enterSwitchId: enterSwitch,
					exitSwitchId: exitSwitch,
					fullPowerTimeInMilliseconds,
					coilId: mainCoil,
					partialPowerPercent,
					partialPowerTimeInDeciseconds,
					restTimeInMilliseconds,
					trigger,
				});
				expect(write).toBeCalledTimes(1);
				expect(write).toBeCalledWith(
					`DL:${toHex(mainCoil)},${toHex(triggerValue)},${toHex(enterSwitch)},75,${toHex(exitSwitch)},${toHex(
						fullPowerTimeInMilliseconds
					)},${toHex(partialPowerTimeInDeciseconds)},1F,${toHex(restTimeInMilliseconds)}\r`
				);
			});
		});
	});
});
