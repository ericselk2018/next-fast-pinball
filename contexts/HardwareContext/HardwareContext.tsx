import { CoilInfo, leftFlipperHoldCoil, leftFlipperMainCoil } from '../../const/Coils/Coils';
import flippers, { FlipperInfo } from '../../const/Flippers/Flippers';
import keyBindings from '../../const/KeyBindings/KeyBindings';
import lights, { LightInfo } from '../../const/Lights/Lights';
import { useVirtualHardware } from '../../const/Setup/Setup';
import Flipper from '../../entities/Flipper';
import Hardware from '../../entities/Hardware';
import Kicker from '../../entities/Kicker';
import Light from '../../entities/Light';
import Switch from '../../entities/Switch';
import TargetSwitch from '../../entities/TargetSwitch';
import FastWriter from '../../lib/FastWriter/FastWriter';
import { bitTest } from '../../lib/math/math';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import switches, { kickerSwitches, SwitchInfo, TargetSwitchInfo } from '../../const/Switches/Switches';

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
	const [switchesOpen, setSwitchesOpen] = useState(
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
						console.log('write', { text });
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
					handler.onToggle?.({ switchInfo, closed });
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

	const enableOrDisableFlippers = useCallback(
		(args: { enable: boolean }) => {
			const { enable } = args;
			enableOrDisableCoil({ enable, coil: leftFlipperMainCoil });
			enableOrDisableCoil({ enable, coil: leftFlipperHoldCoil });
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
				trigger: { enterSwitchCondition: true, exitSwitchCondition: true },
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
				switchCondition: true,
				switchId: buttonSwitch.id,
			});
		},
		[fastWriter.coil]
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
									if (line.startsWith('SA:0E,')) {
										const switchData = line.substring('SA:0E,'.length);
										const getOpen = (id: number) => {
											const byteIndex = id / 8;
											const byteValue = parseInt(
												switchData.substring(byteIndex * 2, byteIndex * 2 + 1),
												16
											);
											return bitTest(byteValue, id % 8);
										};
										setSwitchesOpen(switchesOpen.map((_, id) => getOpen(id)));
									} else if (line.startsWith('/L:') || line.startsWith('-L:')) {
										const isOpenNow = line[0] === '/';
										const switchChangedId = parseInt(line.substring('/L:'.length), 16);
										setSwitchesOpen((switchesOpen) =>
											switchesOpen.map((wasOpen, switchId) =>
												switchId === switchChangedId ? isOpenNow : wasOpen
											)
										);
										const switchInfo = switches.find((aSwitch) => aSwitch.id === switchChangedId);
										if (switchInfo) {
											notifySwitchHitEventHandlers({ switchInfo, closed: !isOpenNow });
										} else {
											console.error(
												`you need to add switch ID ${switchChangedId} to Switches.switches`
											);
										}
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

				disableFlippers();
			} catch (reason: unknown) {
				// dangerous as cast, need to read more about TypeScript specific exception handling
				setLastError(reason as Error);
			}
		},
		[fastWriter, disableFlippers, switchesOpen, notifySwitchHitEventHandlers, configureFlipper]
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
					setSwitchesOpen((switchesOpen) =>
						switchesOpen.map((open, id) => (id === switchInfo.id ? !down : open))
					);

					notifySwitchHitEventHandlers({ switchInfo, closed: down });
				}
			};
			const handleKeyDown = (event: KeyboardEvent) => {
				handleKeyUpOrDown({ event, down: true });
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
				open: switchesOpen[id],
			};
		},
		[addSwitchHitEventHandler, switchesOpen]
	);

	const flipperInfoToFlipper = useCallback(
		(flipperInfo: FlipperInfo): Flipper => {
			const { buttonSwitch, endOfStrokeSwitch } = flipperInfo;
			return {
				buttonSwitch: switchInfoToSwitch(buttonSwitch),
				endOfStrokeSwitch: switchInfoToSwitch(endOfStrokeSwitch),
			};
		},
		[switchInfoToSwitch]
	);

	const targetSwitchInfoToTargetSwitch = useCallback(
		(targetInfo: TargetSwitchInfo): TargetSwitch => {
			const { image, videos } = targetInfo;
			return { ...switchInfoToSwitch(targetInfo), image, videos };
		},
		[switchInfoToSwitch]
	);

	const targetInfoToKicker = useCallback(
		(targetInfo: TargetSwitchInfo): Kicker => {
			return { ...targetSwitchInfoToTargetSwitch(targetInfo), hasBall: false };
		},
		[targetSwitchInfoToTargetSwitch]
	);

	const lightInfoToLight = useCallback((lightInfo: LightInfo): Light => {
		const { name, id } = lightInfo;
		return {
			name,
			id,
		};
	}, []);

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

	const context: Hardware = useMemo(
		() => ({
			flippers: flippers.map(flipperInfoToFlipper),
			kickers: kickerSwitches.map(targetInfoToKicker),
			lights: lights.map(lightInfoToLight),
			switches: switches.map(switchInfoToSwitch),
			switchInfoToSwitch,
			targetSwitchInfoToTargetSwitch,
			enableFlippers,
			disableFlippers,
			addSwitchHandler,
		}),
		[
			flipperInfoToFlipper,
			lightInfoToLight,
			switchInfoToSwitch,
			targetInfoToKicker,
			targetSwitchInfoToTargetSwitch,
			enableFlippers,
			disableFlippers,
			addSwitchHandler,
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
