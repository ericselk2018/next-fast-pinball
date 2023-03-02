import { coinSlotSwitch, inlaneSwitch } from '@/const/Switches/Switches';
import Machine from '@/entities/Machine';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AudioContext from '../AudioContext/AudioContext.client';
import HardwareContext from '../HardwareContext/HardwareContext';

const MachineContext = createContext<Machine>(null!);

export const MachineContextProvider = ({ children }: { children: ReactNode }) => {
	const hardware = useContext(HardwareContext);
	const audio = useContext(AudioContext);
	const [credits, setCredits] = useState(0);
	const coinSlot = hardware.switches.find((aSwitch) => aSwitch.number === coinSlotSwitch.number);

	useEffect(() => {
		if (coinSlot) {
			return coinSlot.addHitHandler({
				onHit: () => {
					setCredits((credits) => credits + 1);
					audio.play({ name: 'rev' });
				},
			});
		}
	}, [coinSlot, audio]);

	const context: Machine = useMemo(
		() => ({
			get credits() {
				return credits;
			},
			set credits(value) {
				setCredits(value);
			},
		}),
		[credits]
	);

	return <MachineContext.Provider value={context}>{children}</MachineContext.Provider>;
};

export default MachineContext;
