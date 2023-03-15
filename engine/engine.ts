import { BumperInfo, bumpers } from 'const/Bumpers/Bumpers';
import { CoilInfo, troughBallEjectCoil } from 'const/Coils/Coils';
import flippers, { FlipperInfo } from 'const/Flippers/Flippers';
import { KickerInfo, kickers } from 'const/Kickers/Kickers';
import { totalBallsInMachine } from 'const/Setup/Setup';
import { SlingshotInfo, slingshots } from 'const/Slingshots/Slingshots';
import switches, {
	plungerRolloverSwitch,
	startButtonSwitch,
	troughBallFiveSwitch,
	troughBallOneSwitch,
	troughSwitches,
} from 'const/Switches/Switches';
import FastWriter from 'lib/FastWriter/FastWriter';
import { bitTest } from 'lib/math/math';
import observable from 'lib/observable/observable';

export declare type Status = 'starting' | 'readyToPlay' | 'playing' | 'waitingForLaunch';

// These will need to be adjusted if FAST changes these.
const usbVendorId = 11914;
const usbProductId = 4155;
const hardwareModel = 8192;

declare type OnChange<T> = (newValue: T) => void;

export const requestPort = () => {
	navigator.serial.requestPort({ filters: [{ usbVendorId, usbProductId }] });
};

const engine = async (args: {
	abortSignal: AbortSignal;
	onStatusChange: OnChange<Status>;
	onBallsInPlayChange: OnChange<number>;
	onErrorChange: OnChange<string>;
	onRequestPort: () => void;
}) => {
	const { onStatusChange, onBallsInPlayChange, onErrorChange, onRequestPort, abortSignal } = args;
	const ports = await navigator.serial.getPorts();
	if (abortSignal.aborted) {
		return;
	}
	if (ports.length !== 1) {
		ports.forEach((port) => port.forget());
		onRequestPort();
		return;
	}
	const port = ports[0];
	await port.open({ baudRate: 921600 });
	if (abortSignal.aborted) {
		await port.close();
		return;
	}

	const writer = port.writable.getWriter();
	const switchesClosed = Array<boolean>(Math.max(...switches.map((aSwitch) => aSwitch.id)) + 1).fill(false);
	const ballsInPlay = observable({ initialValue: 0, onChange: onBallsInPlayChange });
	const status = observable({ initialValue: 'starting', onChange: onStatusChange });
	const error = observable({ initialValue: '', onChange: onErrorChange });

	const handleSwitchesChanged = () => {
		const nonDefaultStateSwitches = switches
			.map((s) => ({ ...s, closed: switchesClosed[s.id] }))
			.filter((s) => s.closed !== !!s.normallyClosed);
		const nonDefaultStateTroughSwitches = nonDefaultStateSwitches.filter((s) =>
			troughSwitches.some((ts) => ts.id === s.id)
		);
		const problemSwitches = nonDefaultStateSwitches.filter((s) => !troughSwitches.some((ts) => ts.id === s.id));
		if (!problemSwitches.length) {
			if (nonDefaultStateTroughSwitches.length === totalBallsInMachine) {
				status.set('readyToPlay');
				error.set('');
			} else {
				const troughSlotsMissingBalls = troughSwitches.filter(
					(ts) => !nonDefaultStateTroughSwitches.some((s) => ts.id === s.id)
				);
				error.set(`waiting for balls in: ${troughSlotsMissingBalls.map((s) => s.name).join(', ')}`);
			}
		} else {
			error.set(`problem switches: ${problemSwitches.map((s) => s.name).join(', ')}`);
		}
	};

	let received = '';
	port.readable.pipeTo(
		new WritableStream({
			write: (chunk: Uint8Array) => {
				const lines = (received + new TextDecoder().decode(chunk)).split('\r');
				lines.forEach((line, index) => {
					// The last part doesn't end with \r so we just save it for now.  We will process it after we get the ending \r
					if (index === lines.length - 1) {
						received = line;
					} else {
						if (!line.startsWith('WD:P')) {
							console.log('read', line);
						}
						if (line.startsWith('SA:0E,')) {
							const switchData = line.substring('SA:0E,'.length);
							const getClosed = (id: number) => {
								const byteIndex = Math.floor(id / 8);
								const byteValue = parseInt(switchData.substring(byteIndex * 2, byteIndex * 2 + 2), 16);
								return bitTest(byteValue, id % 8);
							};
							for (let switchId = 0; switchId < switchesClosed.length; switchId++) {
								switchesClosed[switchId] = getClosed(switchId);
							}
							handleSwitchesChanged();
							console.log({
								initialSwitchesClosed: switches
									.filter((switchInfo) => switchesClosed[switchInfo.id])
									.map((switchInfo) => switchInfo.name),
							});
						} else if (line.startsWith('/L:') || line.startsWith('-L:')) {
							const closed = line[0] === '-';
							const switchId = parseInt(line.substring('/L:'.length), 16);
							console.log(
								`switch ${switches.find((s) => s.id === switchId)?.name} ${closed ? 'closed' : 'open'}`
							);
							switchesClosed[switchId] = closed;
							if (status.get() === 'starting') {
								handleSwitchesChanged();
							} else if (status.get() === 'readyToPlay') {
								if (
									switchId === startButtonSwitch.id &&
									switchesClosed[troughBallOneSwitch.id] !== troughBallOneSwitch.normallyClosed &&
									!ballsInPlay.get()
								) {
									status.set('playing');
									tapCoil({ coil: troughBallEjectCoil });
									ballsInPlay.set(1);
								}
							} else {
								if (
									switchId === troughBallFiveSwitch.id &&
									closed !== troughBallFiveSwitch.normallyClosed
								) {
									ballsInPlay.set(ballsInPlay.get() - 1);
								}

								const ballAtPlunger =
									switchesClosed[plungerRolloverSwitch.id] !== plungerRolloverSwitch.normallyClosed;
								status.set(ballAtPlunger && ballsInPlay.get() === 1 ? 'waitingForLaunch' : 'playing');
								if (
									switchesClosed[troughBallOneSwitch.id] !== troughBallOneSwitch.normallyClosed &&
									!ballsInPlay.get()
								) {
									tapCoil({ coil: troughBallEjectCoil });
									ballsInPlay.set(ballsInPlay.get() + 1);
								}
							}
						}
					}
				});
			},
		}),
		{ signal: abortSignal }
	);

	abortSignal.onabort = async () => {
		await writer.close();
		await port.close();
	};

	const fastWriter = FastWriter({
		write: async (text) => {
			if (writer) {
				if (abortSignal.aborted) {
					return;
				}
				if (!text.startsWith('WD:')) {
					console.log('write', text);
				}
				await writer.write(new TextEncoder().encode(text));
			}
		},
	});

	await fastWriter.clear();
	await fastWriter.configureHardware({ hardwareModel });
	await fastWriter.getSwitchStates();

	const enableOrDisableCoil = (args: { enable: boolean; coil: CoilInfo }) => {
		const { enable, coil } = args;
		(async () => {
			await fastWriter.coil.modifyTrigger({ coilId: coil.id, control: enable ? 'auto' : 'off' });
		})();
	};

	const tapCoil = (args: { coil: CoilInfo }) => {
		const { coil } = args;
		(async () => {
			await fastWriter.coil.modifyTrigger({ coilId: coil.id, control: 'tap' });
		})();
	};

	const enableOrDisableFlippers = (args: { enable: boolean }) => {
		const { enable } = args;
		for (const flipper of flippers) {
			enableOrDisableCoil({ enable, coil: flipper.mainCoil });
			enableOrDisableCoil({ enable, coil: flipper.holdCoil });
		}
	};

	const enableFlippers = () => {
		enableOrDisableFlippers({ enable: true });
	};

	const disableFlippers = () => {
		enableOrDisableFlippers({ enable: false });
	};

	const configureFlipper = async (args: { flipper: FlipperInfo }) => {
		const { flipper } = args;
		const { buttonSwitch, endOfStrokeSwitch, holdCoil, mainCoil } = flipper;

		// Configure Main Coil
		await fastWriter.coil.configureAutoTriggeredDiverter({
			coilId: mainCoil.id,
			trigger: {
				enterSwitchCondition: !buttonSwitch.normallyClosed,
				exitSwitchCondition: !endOfStrokeSwitch.normallyClosed,
			},
			enterSwitchId: buttonSwitch.id,
			exitSwitchId: endOfStrokeSwitch.id,
			fullPowerTimeInMilliseconds: 30,
			partialPowerPercent: 0,
			partialPowerTimeInDeciseconds: 0,
			restTimeInMilliseconds: 90,
		});

		// Configure Hold Coil
		//  I don't understand why these need to be exactly this way, but most other variations cause coil to buzz.
		//  I would think kick power and time should be 0, and latch power could be less than 100%, but does not work.
		await fastWriter.coil.latch({
			coilId: holdCoil.id,
			kickPowerPercent: 1,
			kickTimeInMilliseconds: 10,
			latchPowerPercent: 1,
			restTimeInMilliseconds: 90,
			switchCondition: !buttonSwitch.normallyClosed,
			switchId: buttonSwitch.id,
		});
	};

	const configureSlingshot = async (args: { slingshot: SlingshotInfo }) => {
		const { slingshot } = args;
		const { coil, switchInfo } = slingshot;

		await fastWriter.coil.configurePulse({
			coilId: coil.id,
			switchId: switchInfo.id,
			switchCondition: !switchInfo.normallyClosed,
			pulsePowerPercent: 1,
			pulseTimeInMilliseconds: 30,
			restTimeInMilliseconds: 90,
		});
	};

	const configureKicker = async (args: { kicker: KickerInfo }) => {
		const { kicker } = args;
		const { coil } = kicker;

		await fastWriter.coil.configurePulse({
			coilId: coil.id,
			pulsePowerPercent: 1,
			pulseTimeInMilliseconds: 30,
			restTimeInMilliseconds: 90,
		});
	};

	const configureManualCoil = async (args: { coil: CoilInfo }) => {
		const { coil } = args;

		await fastWriter.coil.configurePulse({
			coilId: coil.id,
			pulsePowerPercent: 1,
			pulseTimeInMilliseconds: 30,
			restTimeInMilliseconds: 90,
		});
	};

	const configureBumper = async (args: { bumper: BumperInfo }) => {
		const { bumper } = args;
		const { coil, switchInfo } = bumper;

		await fastWriter.coil.configurePulse({
			coilId: coil.id,
			switchId: switchInfo.id,
			switchCondition: !switchInfo.normallyClosed,
			pulsePowerPercent: 1,
			pulseTimeInMilliseconds: 30,
			restTimeInMilliseconds: 90,
		});
	};

	for (const flipper of flippers) {
		await configureFlipper({ flipper });
	}

	for (const slingshot of slingshots) {
		await configureSlingshot({ slingshot });
	}

	for (const kicker of kickers) {
		await configureKicker({ kicker });
	}

	for (const bumper of bumpers) {
		await configureBumper({ bumper });
	}

	await configureManualCoil({ coil: troughBallEjectCoil });

	const watchdogInterval = setInterval(() => {
		if (abortSignal.aborted) {
			clearInterval(watchdogInterval);
		} else {
			fastWriter.setWatchdog({ timeoutInMilliseconds: 1000 });
		}
	}, 500);

	if (hardwareModel + 12 === 123) {
		await disableFlippers();
		await enableFlippers();
	}
};

export default engine;
