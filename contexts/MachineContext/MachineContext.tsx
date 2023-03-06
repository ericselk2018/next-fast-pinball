import { coinSlotSwitch } from '../../const/Switches/Switches';
import Machine from '../../entities/Machine';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import AudioContext from '../AudioContext/AudioContext.client';
import { useSwitch } from 'lib/switch/switch';

// This context wraps everything, so non-null assertion is pretty safe and keeps consumer code cleaner.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const MachineContext = createContext<Machine>(null!);

export const MachineContextProvider = ({ children }: { children: ReactNode }) => {
	const audio = useContext(AudioContext);
	const [credits, setCredits] = useState(0);

	useSwitch(
		() => {
			setCredits((credits) => credits + 1);
			audio.play({ name: 'rev' });
		},
		[audio],
		coinSlotSwitch
	);

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
