import keyBindings from '@/const/KeyBindings/KeyBindings';
import Switch from '@/entities/Switch/Switch';
import { bitTest } from '@/lib/math/math';
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import switchInfo, { leftFlipperButtonSwitch } from '../../const/Switches/Switches';

// These will need to be adjusted if FAST changes these.
const usbVendorId = 11914;
const usbProductId = 4155;
const hardwareModel = 2000;

interface HardwareContext {
	switches: Switch[];
}

const HardwareContext = createContext<HardwareContext>(null!);

export const HardwareContextProvider = ({ children }: { children: ReactNode }) => {
	const [lastError, setLastError] = useState<Error>();
	const [received, setReceived] = useState('');
	const [switches, setSwitches] = useState(switchInfo);
	const [permissionRequired, setPermissionRequired] = useState(false);
	const [usingVirtualHardware, setUsingVirtualHardware] = useState(false);
	const [bootDone, setBootDone] = useState(false);

	const open = async (port: SerialPort) => {
		try {
			await port.open({ baudRate: 921600 });
			await port.readable.pipeTo(
				new WritableStream({
					write: (chunk: Uint8Array) => {
						setReceived((received) => received + new TextDecoder().decode(chunk));
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
	};

	useEffect(() => {
		const lines = received.split('\r');
		lines.forEach((line, index) => {
			if (index === lines.length - 1) {
				setReceived(line);
			} else {
				if (line.startsWith('SA:0E,')) {
					const switchData = line.substring('SA:0E,'.length);
					const getOpen = (s: Switch) => {
						const byteIndex = s.number / 8;
						const byteValue = parseInt(switchData.substring(byteIndex * 2, byteIndex * 2 + 1), 16);
						return bitTest(byteValue, s.number % 8);
					};
					setSwitches((switches) => switches.map((s) => new Switch({ switch: s, open: getOpen(s) })));
				} else if (line.startsWith('/L:') || line.startsWith('-L:')) {
					const open = line[0] === '/';
					const number = parseInt(line.substring('/L:'.length), 16);
					setSwitches((switches) =>
						switches.map((s) => (s.number === number ? new Switch({ switch: s, open }) : s))
					);
				}
			}
		});
	}, [received]);

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
	}, [lastError, usingVirtualHardware]);

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
					setSwitches((switches) =>
						switches.map((s) =>
							s.number === keyBinding.switch.number ? new Switch({ switch: s, open: false }) : s
						)
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
					setSwitches((switches) =>
						switches.map((s) =>
							s.number === keyBinding.switch.number ? new Switch({ switch: s, open: true }) : s
						)
					);
				}
			};
			document.addEventListener('keyup', handleKeyUp);
			return () => document.removeEventListener('keyup', handleKeyUp);
		}
	}, [usingVirtualHardware]);

	const context: HardwareContext = useMemo(() => ({ switches }), [switches]);

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

export const useSwitchHit = (args: { switch: Switch; onHit: () => void }) => {
	const { switches } = useContext(HardwareContext);
	const { switch: aSwitch, onHit } = args;
	const onHitRef = useRef(onHit);
	onHitRef.current = onHit;
	const theSwitch = switches.find((s) => s.number === aSwitch.number);
	const previousOpen = useRef(aSwitch.open);

	useEffect(() => {
		if (theSwitch) {
			if (previousOpen.current !== undefined && theSwitch.open !== previousOpen.current && theSwitch.open) {
				onHitRef.current();
			}
			previousOpen.current = theSwitch.open;
		}
	}, [theSwitch]);
};
