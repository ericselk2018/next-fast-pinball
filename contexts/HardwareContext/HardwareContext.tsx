import { CoilInfo, leftFlipperHoldCoil, leftFlipperMainCoil } from '@/const/Coils/Coils';
import flippers, { FlipperInfo } from '@/const/Flippers/Flippers';
import keyBindings from '@/const/KeyBindings/KeyBindings';
import lights, { LightInfo } from '@/const/Lights/Lights';
import { useVirtualHardware } from '@/const/Setup/Setup';
import Flipper from '@/entities/Flipper';
import Hardware from '@/entities/Hardware';
import Kicker from '@/entities/Kicker';
import Light from '@/entities/Light';
import Switch from '@/entities/Switch';
import TargetSwitch from '@/entities/TargetSwitch';
import { bitTest } from '@/lib/math/math';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import switches, { kickerSwitches, SwitchInfo, TargetSwitchInfo } from '../../const/Switches/Switches';

// These will need to be adjusted if FAST changes these.
const usbVendorId = 11914;
const usbProductId = 4155;
const hardwareModel = 2000;

interface SwitchHitEventHandler {
	switchNumbers: number[];
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
		Array<boolean>(Math.max(...switches.map((aSwitch) => aSwitch.number))).fill(false)
	);
	const switchHitEventHandlers = useRef<SwitchHitEventHandler[]>([]);
	const portWriter = useRef<WritableStreamDefaultWriter>();

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
		const { number, normallyClosed } = switchInfo;
		switchHitEventHandlers.current.forEach((handler) =>
			handler.switchNumbers
				.filter((n) => n === number)
				.forEach(() => {
					if (!!normallyClosed !== closed) {
						handler.onHit?.(switchInfo);
					}
					handler.onToggle?.({ switchInfo, closed });
				})
		);
	}, []);

	const writeLine = useCallback(async (text: string) => {
		const writer = portWriter.current;
		if (writer) {
			await writer.write(new TextEncoder().encode(text + '\r'));
		}
	}, []);

	const open = useCallback(
		async (port: SerialPort) => {
			try {
				await port.open({ baudRate: 921600 });
				await port.readable.pipeTo(
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
										const getOpen = (number: number) => {
											const byteIndex = number / 8;
											const byteValue = parseInt(
												switchData.substring(byteIndex * 2, byteIndex * 2 + 1),
												16
											);
											return bitTest(byteValue, number % 8);
										};
										setSwitchesOpen(switchesOpen.map((_, number) => getOpen(number)));
									} else if (line.startsWith('/L:') || line.startsWith('-L:')) {
										const isOpenNow = line[0] === '/';
										const switchChangedNumber = parseInt(line.substring('/L:'.length), 16);
										setSwitchesOpen((switchesOpen) =>
											switchesOpen.map((wasOpen, switchNumber) =>
												switchNumber === switchChangedNumber ? isOpenNow : wasOpen
											)
										);
										const switchInfo = switches.find(
											(aSwitch) => aSwitch.number === switchChangedNumber
										);
										if (switchInfo) {
											notifySwitchHitEventHandlers({ switchInfo, closed: !isOpenNow });
										}
									}
								}
							});
						},
					})
				);
				const writer = port.writable.getWriter();
				portWriter.current = writer;
				await writeLine('ID:');
				await writeLine(`CH:${hardwareModel},1`);
				await writeLine('SA:');
			} catch (reason: unknown) {
				// dangerous as cast, need to read more about TypeScript specific exception handling
				setLastError(reason as Error);
			}
		},
		[notifySwitchHitEventHandlers, switchesOpen, writeLine]
	);

	useEffect(() => {
		if (!lastError && !usingVirtualHardware) {
			navigator.serial
				.getPorts()
				.then((ports) => {
					if (ports.length === 1) {
						open(ports[0]);
					} else {
						ports.forEach((port) => port.forget());
						setPermissionRequired(true);
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

	useEffect(() => {
		if (lastError) {
			const timeout = setTimeout(() => {
				setLastError(undefined);
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [lastError]);

	useEffect(() => {
		if (usingVirtualHardware) {
			const handleKeyDown = (event: KeyboardEvent) => {
				const keyBinding = keyBindings.find(
					(keyBinding) =>
						keyBinding.key === event.key &&
						(keyBinding.location === undefined || keyBinding.location === event.location)
				);
				if (keyBinding) {
					const { switch: switchInfo } = keyBinding;
					event.preventDefault();
					setSwitchesOpen((switchesOpen) =>
						switchesOpen.map((open, number) => (number === switchInfo.number ? false : open))
					);

					notifySwitchHitEventHandlers({ switchInfo, closed: true });
				}
			};
			document.addEventListener('keydown', handleKeyDown);
			return () => document.removeEventListener('keydown', handleKeyDown);
		}
	}, [notifySwitchHitEventHandlers, usingVirtualHardware]);

	useEffect(() => {
		if (usingVirtualHardware) {
			const handleKeyUp = (event: KeyboardEvent) => {
				const keyBinding = keyBindings.find(
					(keyBinding) =>
						keyBinding.key === event.key &&
						(keyBinding.location === undefined || keyBinding.location === event.location)
				);
				if (keyBinding) {
					const { switch: switchInfo } = keyBinding;
					event.preventDefault();
					setSwitchesOpen((switchesOpen) =>
						switchesOpen.map((open, number) => (number === switchInfo.number ? true : open))
					);

					notifySwitchHitEventHandlers({ switchInfo, closed: false });
				}
			};
			document.addEventListener('keyup', handleKeyUp);
			return () => document.removeEventListener('keyup', handleKeyUp);
		}
	}, [usingVirtualHardware, notifySwitchHitEventHandlers]);

	const switchInfoToSwitch = useCallback(
		(switchInfo: SwitchInfo): Switch => {
			const { name, number } = switchInfo;
			return {
				addHitHandler: (args) => {
					const { onHit } = args;
					return addSwitchHitEventHandler({
						switchNumbers: [number],
						onHit,
					});
				},
				addToggleHandler: (args) => {
					const { onToggle } = args;
					return addSwitchHitEventHandler({
						switchNumbers: [number],
						onToggle,
					});
				},
				name,
				number,
				open: switchesOpen[number],
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
		const { name, number } = lightInfo;
		return {
			name,
			number,
		};
	}, []);

	const enableOrDisableCoil = useCallback(
		(args: { enable: boolean; coil: CoilInfo }) => {
			const { enable } = args;
			// TODO: figure out how flippers should work once docs are updated
			if (enable) {
				writeLine(``);
			}
		},
		[writeLine]
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

	const addSwitchHandler = useCallback(
		(args: {
			switches: ReadonlyArray<SwitchInfo>;
			onHit?: (switchInfo: SwitchInfo) => void;
			onToggle?: (args: { switchInfo: SwitchInfo; closed: boolean }) => void;
		}) => {
			const { switches, onHit, onToggle } = args;
			return addSwitchHitEventHandler({
				switchNumbers: switches.map((switchInfo) => switchInfo.number),
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
