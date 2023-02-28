import modes from '@/const/Modes/Modes';
import { coinSlotSwitch, inlaneSwitch } from '@/const/Switches/Switches';
import Game from '@/entities/Game/Game';
import Mode from '@/entities/Mode/Mode';
import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { useSwitchHit } from '../HardwareContext/HardwareContext';

interface MachineContext {
	credits: number;
	consumeCredits: (args: { creditsUsed: number }) => void;
}

const MachineContext = createContext<MachineContext>(null!);

export const MachineContextProvider = ({ children }: { children: ReactNode }) => {
	const [credits, setCredits] = useState(0);

	useSwitchHit({
		switch: coinSlotSwitch,
		onHit: () => {
			setCredits((credits) => credits + 1);
		},
	});

	const consumeCredits = useCallback((args: { creditsUsed: number }) => {
		const { creditsUsed } = args;
		setCredits((credits) => Math.max(0, credits - creditsUsed));
	}, []);

	const context: MachineContext = useMemo(
		() => ({
			credits,
			consumeCredits,
		}),
		[credits, consumeCredits]
	);

	return <MachineContext.Provider value={context}>{children}</MachineContext.Provider>;
};

export default MachineContext;
