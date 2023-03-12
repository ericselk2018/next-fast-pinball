import {
	CoilInfo,
	leftFlipperHoldCoil,
	leftFlipperMainCoil,
	rightFlipperHoldCoil,
	rightFlipperMainCoil,
	troughBallEjectCoil,
} from '../../const/Coils/Coils';
import flippers, { FlipperInfo } from '../../const/Flippers/Flippers';
import keyBindings from '../../const/KeyBindings/KeyBindings';
import { useVirtualHardware } from '../../const/Setup/Setup';
import Hardware from '../../entities/Hardware';
import Switch from '../../entities/Switch';
import TargetSwitch from '../../entities/TargetSwitch';
import FastWriter from '../../lib/FastWriter/FastWriter';
import { bitTest } from '../../lib/math/math';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import switches, {
	plungerRolloverSwitch,
	SwitchInfo,
	TargetSwitchInfo,
	troughBallOneSwitch,
	virtualClosedAtStartSwitches,
} from '../../const/Switches/Switches';
import { SlingshotInfo, slingshots } from 'const/Slingshots/Slingshots';
import { KickerInfo, kickers } from 'const/Kickers/Kickers';
import { BumperInfo, bumpers } from 'const/Bumpers/Bumpers';

// These will need to be adjusted if FAST changes these.
const usbVendorId = 11914;
const usbProductId = 4155;
const hardwareModel = 8192;

interface SwitchHitEventHandler {
	switchIds: number[];
	onHit?: (switchInfo: SwitchInfo) => void;
	onToggle?: (args: { switchInfo: SwitchInfo; closed: boolean }) => void;
}

// This context wraps everything, so non-null assertion is pretty safe and keeps consumer code cleaner.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const HardwareContext = createContext<Hardware>(null!);

export const HardwareContextProvider = ({ children }: { children: ReactNode }) => {
	const [lastError, setLastError] = useState<Error>();
	const received = useRef('');
	const [permissionRequired, setPermissionRequired] = useState(false);
	const [usingVirtualHardware, setUsingVirtualHardware] = useState(useVirtualHardware);
	const [bootDone, setBootDone] = useState(usingVirtualHardware);
	const [switchesClosed, setSwitchesClosed] = useState(
		Array<boolean>(Math.max(...switches.map((aSwitch) => aSwitch.id))).fill(false)
	);
	const switchHitEventHandlers = useRef<SwitchHitEventHandler[]>([]);
	const portWriter = useRef<WritableStreamDefaultWriter>();
	const opening = useRef(false);

	const fastWriter = useMemo(() => {
		return FastWriter({
			write: async (text) => {
				const writer = portWriter.current;
				if (writer) {
					if (!text.startsWith('WD:')) {
						console.log('write', text);
					}
					await writer.write(new TextEncoder().encode(text));
				}
			},
		});
	}, []);

	const addSwitchHitEventHandler = useCallback((handler: SwitchHitEventHandler) => {
		switchHitEventHandlers.current.push(handler);
		return () => {
			const i = switchHitEventHandlers.current.indexOf(handler);
			if (i !== -1) {
				switchHitEventHandlers.current.splice(i, 1);
			}
		};
	}, []);

	const notifySwitchHitEventHandlers = useCallback((args: { switchInfo: SwitchInfo; closed: boolean }) => {
		const { switchInfo, closed } = args;
		const { id, normallyClosed } = switchInfo;
		const hit = !!normallyClosed !== closed;
		console.log('switch', { name: switchInfo.name, closed, hit });
		switchHitEventHandlers.current.forEach((handler) =>
			handler.switchIds
				.filter((n) => n === id)
				.forEach(() => {
					if (hit) {
						handler.onHit?.(switchInfo);
					}
					handler.onToggle?.({ switchInfo, closed: normallyClosed ? !closed : closed });
				})
		);
	}, []);

	const enableOrDisableCoil = useCallback(
		(args: { enable: boolean; coil: CoilInfo }) => {
			const { enable, coil } = args;
			(async () => {
				await fastWriter.coil.modifyTrigger({ coilId: coil.id, control: enable ? 'auto' : 'off' });
			})();
		},
		[fastWriter.coil]
	);

	const tapCoil = useCallback(
		(args: { coil: CoilInfo }) => {
			const { coil } = args;
			(async () => {
				await fastWriter.coil.modifyTrigger({ coilId: coil.id, control: 'tap' });
			})();
		},
		[fastWriter.coil]
	);

	const enableOrDisableFlippers = useCallback(
		(args: { enable: boolean }) => {
			const { enable } = args;
			enableOrDisableCoil({ enable, coil: leftFlipperMainCoil });
			enableOrDisableCoil({ enable, coil: leftFlipperHoldCoil });
			enableOrDisableCoil({ enable, coil: rightFlipperMainCoil });
			enableOrDisableCoil({ enable, coil: rightFlipperHoldCoil });
		},
		[enableOrDisableCoil]
	);

	const enableFlippers = useCallback(() => {
		enableOrDisableFlippers({ enable: true });
	}, [enableOrDisableFlippers]);

	const disableFlippers = useCallback(() => {
		enableOrDisableFlippers({ enable: false });
	}, [enableOrDisableFlippers]);

	const configureFlipper = useCallback(
		async (args: { flipper: FlipperInfo }) => {
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
		},
		[fastWriter.coil]
	);

	const configureSlingshot = useCallback(
		async (args: { slingshot: SlingshotInfo }) => {
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
		},
		[fastWriter.coil]
	);

	const configureKicker = useCallback(
		async (args: { kicker: KickerInfo }) => {
			const { kicker } = args;
			const { coil, switchInfo } = kicker;

			await fastWriter.coil.configurePulse({
				coilId: coil.id,
				switchId: switchInfo.id,
				switchCondition: !switchInfo.normallyClosed,
				pulsePowerPercent: 1,
				pulseTimeInMilliseconds: 30,
				restTimeInMilliseconds: 90,
			});
		},
		[fastWriter.coil]
	);

	const configureManualCoil = useCallback(
		async (args: { coil: CoilInfo }) => {
			const { coil } = args;

			await fastWriter.coil.configurePulse({
				coilId: coil.id,
				pulsePowerPercent: 1,
				pulseTimeInMilliseconds: 30,
				restTimeInMilliseconds: 90,
			});
		},
		[fastWriter.coil]
	);

	const configureBumper = useCallback(
		async (args: { bumper: BumperInfo }) => {
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
		},
		[fastWriter.coil]
	);

	const setSwitchClosed = useCallback(
		(args: { switchId: number; closed: boolean }) => {
			const { switchId, closed } = args;
			setSwitchesClosed((switchesClosed) =>
				switchesClosed.map((wasClosed, id) => (id === switchId ? closed : wasClosed))
			);
			const switchInfo = switches.find((aSwitch) => aSwitch.id === switchId);
			if (switchInfo) {
				notifySwitchHitEventHandlers({ switchInfo, closed });
			} else {
				console.error(`you need to add switch ID ${switchId} to Switches.switches`);
			}
		},
		[notifySwitchHitEventHandlers]
	);

	const open = useCallback(
		async (port: SerialPort) => {
			try {
				await port.open({ baudRate: 921600 });
				port.readable.pipeTo(
					new WritableStream({
						write: (chunk: Uint8Array) => {
							const lines = (received.current + new TextDecoder().decode(chunk)).split('\r');
							lines.forEach((line, index) => {
								// The last part doesn't end with \r so we just save it for now.  We will process it after we get the ending \r
								if (index === lines.length - 1) {
									received.current = line;
								} else {
									if (!line.startsWith('WD:P')) {
										console.log('read', line);
									}
									if (line.startsWith('SA:0E,')) {
										const switchData = line.substring('SA:0E,'.length);
										const getClosed = (id: number) => {
											const byteIndex = Math.floor(id / 8);
											const byteValue = parseInt(
												switchData.substring(byteIndex * 2, byteIndex * 2 + 2),
												16
											);
											return bitTest(byteValue, id % 8);
										};
										const initialSwitchesClosed = switchesClosed.map((_, id) => getClosed(id));
										setSwitchesClosed(initialSwitchesClosed);
										console.log({
											initialSwitchesClosed: switches
												.filter((switchInfo) => initialSwitchesClosed[switchInfo.id])
												.map((switchInfo) => switchInfo.name),
										});
									} else if (line.startsWith('/L:') || line.startsWith('-L:')) {
										const closed = line[0] === '-';
										const switchId = parseInt(line.substring('/L:'.length), 16);
										setSwitchClosed({ switchId, closed });
									}
								}
							});
						},
					})
				);
				const writer = port.writable.getWriter();
				portWriter.current = writer;
				await fastWriter.clear();
				await fastWriter.configureHardware({ hardwareModel });
				await fastWriter.getSwitchStates();

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

				configureManualCoil({ coil: troughBallEjectCoil });

				disableFlippers();
			} catch (reason: unknown) {
				// dangerous as cast, need to read more about TypeScript specific exception handling
				setLastError(reason as Error);
			}
		},
		[
			configureBumper,
			configureFlipper,
			configureKicker,
			configureManualCoil,
			configureSlingshot,
			disableFlippers,
			fastWriter,
			setSwitchClosed,
			switchesClosed,
		]
	);

	// Keep watchdog happy.  FAST uses this to disable things if our app crashes or loses the connection.
	//  We ping it every 500ms and tell it to shutdown if we don't ping again within 1000ms.
	useEffect(() => {
		if (!usingVirtualHardware && !lastError && bootDone && !permissionRequired) {
			const updateWatchdog = () => {
				fastWriter.setWatchdog({ timeoutInMilliseconds: 1000 });
			};
			const interval = setInterval(updateWatchdog, 500);
			updateWatchdog();
			return () => clearInterval(interval);
		}
	}, [bootDone, fastWriter, lastError, permissionRequired, usingVirtualHardware]);

	// Attempt to open port if not in error state, not already open, and not using virtual hardware.
	useEffect(() => {
		if (!lastError && !usingVirtualHardware && !opening.current) {
			opening.current = true;
			navigator.serial
				.getPorts()
				.then((ports) => {
					if (ports.length === 1) {
						open(ports[0]);
					} else {
						ports.forEach((port) => port.forget());
						setPermissionRequired(true);
						opening.current = false;
					}
				})
				.catch((reason) => {
					setLastError(reason);
				})
				.finally(() => {
					setBootDone(true);
				});
		}
	}, [lastError, open, usingVirtualHardware]);

	// Handle retry after error.  Just waits 3 seconds and then tries again.
	useEffect(() => {
		if (lastError) {
			opening.current = false;
			const timeout = setTimeout(() => {
				setLastError(undefined);
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [lastError]);

	// Watch keyboard events while using virtual hardware.
	useEffect(() => {
		if (usingVirtualHardware) {
			const handleKeyUpOrDown = (args: { event: KeyboardEvent; down: boolean }) => {
				const { event, down } = args;
				const keyBinding = keyBindings.find(
					(keyBinding) =>
						keyBinding.key === event.key &&
						(keyBinding.location === undefined || keyBinding.location === event.location)
				);
				if (keyBinding) {
					const { switch: switchInfo } = keyBinding;
					event.preventDefault();
					setSwitchesClosed((switchesClosed) =>
						switchesClosed.map((closed, id) => (id === switchInfo.id ? down : closed))
					);

					notifySwitchHitEventHandlers({ switchInfo, closed: down });
				}
			};
			const handleKeyDown = (event: KeyboardEvent) => {
				if (!event.repeat) {
					handleKeyUpOrDown({ event, down: true });
				}
			};
			const handleKeyUp = (event: KeyboardEvent) => {
				handleKeyUpOrDown({ event, down: false });
			};
			document.addEventListener('keydown', handleKeyDown);
			document.addEventListener('keyup', handleKeyUp);
			return () => {
				document.removeEventListener('keydown', handleKeyDown);
				document.removeEventListener('keyup', handleKeyUp);
			};
		}
	}, [notifySwitchHitEventHandlers, usingVirtualHardware]);

	const switchInfoToSwitch = useCallback(
		(switchInfo: SwitchInfo): Switch => {
			const { name, id } = switchInfo;
			return {
				addHitHandler: (args) => {
					const { onHit } = args;
					return addSwitchHitEventHandler({
						switchIds: [id],
						onHit,
					});
				},
				addToggleHandler: (args) => {
					const { onToggle } = args;
					return addSwitchHitEventHandler({
						switchIds: [id],
						onToggle,
					});
				},
				name,
				id: id,
				closed: switchesClosed[id],
			};
		},
		[addSwitchHitEventHandler, switchesClosed]
	);

	const targetSwitchInfoToTargetSwitch = useCallback(
		(targetInfo: TargetSwitchInfo): TargetSwitch => {
			const { image, videos } = targetInfo;
			return { ...switchInfoToSwitch(targetInfo), image, videos };
		},
		[switchInfoToSwitch]
	);

	const addSwitchHandler = useCallback(
		(args: {
			switches: ReadonlyArray<SwitchInfo>;
			onHit?: (switchInfo: SwitchInfo) => void;
			onToggle?: (args: { switchInfo: SwitchInfo; closed: boolean }) => void;
		}) => {
			const { switches, onHit, onToggle } = args;
			return addSwitchHitEventHandler({
				switchIds: switches.map((switchInfo) => switchInfo.id),
				onHit,
				onToggle,
			});
		},
		[addSwitchHitEventHandler]
	);

	const ejectBall = useCallback(() => {
		tapCoil({ coil: troughBallEjectCoil });

		// Simulate the ball ejecting when using virtual hardware.
		if (usingVirtualHardware) {
			setTimeout(() => {
				setSwitchClosed({ switchId: troughBallOneSwitch.id, closed: true });
				setTimeout(() => {
					setSwitchClosed({ switchId: plungerRolloverSwitch.id, closed: false });
				}, 1000);
			}, 500);
		}
	}, [setSwitchClosed, tapCoil, usingVirtualHardware]);

	const isSwitchClosed = useCallback(
		(args: { switchInfo: SwitchInfo }) => {
			const { switchInfo } = args;
			const { id } = switchInfo;
			return switchInfo.normallyClosed ? !switchesClosed[id] : switchesClosed[id];
		},
		[switchesClosed]
	);

	// Keep some global variables updated for debug purposes, so we can inspect them in browser console easily.
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(global as any).hardware = {
			switchesClosed,
			closedSwitches: switches
				.filter((switchInfo) => isSwitchClosed({ switchInfo }))
				.map((switchInfo) => switchInfo.name),
		};
	}, [isSwitchClosed, switchesClosed]);

	const context: Hardware = useMemo(
		() => ({
			switchInfoToSwitch,
			targetSwitchInfoToTargetSwitch,
			enableFlippers,
			disableFlippers,
			addSwitchHandler,
			ejectBall,
			isSwitchClosed,
		}),
		[
			addSwitchHandler,
			disableFlippers,
			enableFlippers,
			switchInfoToSwitch,
			targetSwitchInfoToTargetSwitch,
			ejectBall,
			isSwitchClosed,
		]
	);

	if (lastError) {
		return <div>{lastError.toString() || 'error'}</div>;
	}

	const handleSelectPortClick = () => {
		navigator.serial
			.requestPort({ filters: [{ usbVendorId, usbProductId }] })
			.then((port) => {
				setPermissionRequired(false);
				open(port);
			})
			.catch((reason) => {
				setLastError(reason);
			});
	};

	const handleUseVirtualHardwareClick = () => {
		setUsingVirtualHardware(true);
		setPermissionRequired(false);
		setSwitchesClosed((switchesClosed) =>
			switchesClosed.map(
				(_, switchId) => !!virtualClosedAtStartSwitches.find((switchInfo) => switchInfo.id === switchId)
			)
		);
	};

	if (permissionRequired) {
		return (
			<>
				<button onClick={handleSelectPortClick}>Select Port</button>
				<button onClick={handleUseVirtualHardwareClick}>Use Virtual Hardware</button>
			</>
		);
	}

	if (!bootDone) {
		return null;
	}

	return <HardwareContext.Provider value={context}>{children}</HardwareContext.Provider>;
};

export default HardwareContext;
