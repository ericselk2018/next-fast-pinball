import flippers, { FlipperInfo } from '@/const/Flippers/Flippers';
import keyBindings from '@/const/KeyBindings/KeyBindings';
import lights, { LightInfo } from '@/const/Lights/Lights';
import Flipper from '@/entities/Flipper';
import Hardware from '@/entities/Hardware';
import Kicker from '@/entities/Kicker';
import Light from '@/entities/Light';
import Switch from '@/entities/Switch';
import Target from '@/entities/Target';
import { bitTest } from '@/lib/math/math';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import switches, { kickerSwitches, SwitchInfo, TargetInfo } from '../../const/Switches/Switches';

// These will need to be adjusted if FAST changes these.
const usbVendorId = 11914;
const usbProductId = 4155;
const hardwareModel = 2000;

interface SwitchHitEventHandler {
	switchNumber: number;
	onHit: () => void;
}

const HardwareContext = createContext<Hardware>(null!);

export const HardwareContextProvider = ({ children }: { children: ReactNode }) => {
	const [lastError, setLastError] = useState<Error>();
	const received = useRef('');
	const [permissionRequired, setPermissionRequired] = useState(false);
	const [usingVirtualHardware, setUsingVirtualHardware] = useState(false);
	const [bootDone, setBootDone] = useState(false);
	const [switchesOpen, setSwitchesOpen] = useState(
		Array<boolean>(Math.max(...switches.map((aSwitch) => aSwitch.number))).fill(false)
	);
	const switchHitEventHandlers = useRef<SwitchHitEventHandler[]>([]).current;

	const addSwitchHitEventHandler = useCallback(
		(handler: SwitchHitEventHandler) => {
			switchHitEventHandlers.push(handler);
			return () => {
				const i = switchHitEventHandlers.indexOf(handler);
				if (i !== -1) {
					switchHitEventHandlers.splice(i, 1);
				}
			};
		},
		[switchHitEventHandlers]
	);

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
									}
								}
							});
						},
					})
				);
				const writer = port.writable.getWriter();
				const writeLine = async (text: string) => {
					await writer.write(new TextEncoder().encode(text + '\r'));
				};
				await writeLine('ID:');
				await writeLine(`CH:${hardwareModel},1`);
				await writeLine('SA:');
			} catch (reason: any) {
				setLastError(reason);
			}
		},
		[switchesOpen]
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
					event.preventDefault();
					setSwitchesOpen((switchesOpen) =>
						switchesOpen.map((open, number) => (number === keyBinding.switch.number ? false : open))
					);
				}
			};
			document.addEventListener('keydown', handleKeyDown);
			return () => document.removeEventListener('keydown', handleKeyDown);
		}
	}, [usingVirtualHardware]);

	useEffect(() => {
		if (usingVirtualHardware) {
			const handleKeyUp = (event: KeyboardEvent) => {
				const keyBinding = keyBindings.find(
					(keyBinding) =>
						keyBinding.key === event.key &&
						(keyBinding.location === undefined || keyBinding.location === event.location)
				);
				if (keyBinding) {
					event.preventDefault();
					setSwitchesOpen((switchesOpen) =>
						switchesOpen.map((open, number) => (number === keyBinding.switch.number ? true : open))
					);
				}
			};
			document.addEventListener('keyup', handleKeyUp);
			return () => document.removeEventListener('keyup', handleKeyUp);
		}
	}, [usingVirtualHardware]);

	const switchInfoToSwitch = useCallback(
		(switchInfo: SwitchInfo): Switch => {
			const { name, number } = switchInfo;
			return {
				addHitHandler: (args) => {
					return () => {
						//
					};
				},
				name,
				number,
				open: switchesOpen[number],
			};
		},
		[switchesOpen]
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

	const targetInfoToTarget = useCallback(
		(targetInfo: TargetInfo): Target => {
			const { image, videos } = targetInfo;
			return { ...switchInfoToSwitch(targetInfo), image, videos };
		},
		[switchInfoToSwitch]
	);

	const targetInfoToKicker = useCallback(
		(targetInfo: TargetInfo): Kicker => {
			return { ...targetInfoToTarget(targetInfo), hasBall: false };
		},
		[targetInfoToTarget]
	);

	const lightInfoToLight = useCallback((lightInfo: LightInfo): Light => {
		const { name, number } = lightInfo;
		return {
			name,
			number,
		};
	}, []);

	const context: Hardware = useMemo(
		() => ({
			flippers: flippers.map(flipperInfoToFlipper),
			kickers: kickerSwitches.map(targetInfoToKicker),
			lights: lights.map(lightInfoToLight),
			switches: switches.map(switchInfoToSwitch),
			switchInfoToSwitch,
		}),
		[flipperInfoToFlipper, lightInfoToLight, switchInfoToSwitch, targetInfoToKicker]
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
