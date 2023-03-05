import { fast } from './fast';

describe('fast', () => {
	describe('configureHardware', () => {
		it('should write correct command', async () => {
			const write = jest.fn();
			const hardwareModel = 1234;
			await fast({ write }).configureHardware({ hardwareModel });
			expect(write).toBeCalledTimes(1);
			expect(write).toBeCalledWith(`CH:${hardwareModel.toString(16)},1\r`);
		});
	});
	describe('getSwitchStates', () => {
		it('should write correct command', async () => {
			const write = jest.fn();
			await fast({ write }).getSwitchStates();
			expect(write).toBeCalledTimes(1);
			expect(write).toBeCalledWith(`SA:\r`);
		});
	});
	describe('setWatchdog', () => {
		it('should write correct command', async () => {
			const write = jest.fn();
			const timeoutInMilliseconds = 1234;
			await fast({ write }).setWatchdog({ timeoutInMilliseconds });
			expect(write).toBeCalledTimes(1);
			expect(write).toBeCalledWith(`WD:${timeoutInMilliseconds.toString(16)}\r`);
		});
	});
	describe('driver', () => {
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
				await fast({ write }).driver.configureAutoTriggeredDiverter({
					enterSwitchId: enterSwitch,
					exitSwitchId: exitSwitch,
					fullPowerTimeInMilliseconds,
					driverId: mainCoil,
					partialPowerPercent,
					partialPowerTimeInDeciseconds,
					restTimeInMilliseconds,
					trigger,
				});
				expect(write).toBeCalledTimes(1);
				expect(write).toBeCalledWith(
					`DL:${mainCoil.toString(16)},${triggerValue.toString(16)},${enterSwitch.toString(
						16
					)},75,${exitSwitch.toString(16)},${fullPowerTimeInMilliseconds.toString(
						16
					)},${partialPowerTimeInDeciseconds.toString(16)},${(partialPowerPercent * 255).toString(
						16
					)},${restTimeInMilliseconds.toString(16)}\r`
				);
			});
		});
	});
});
