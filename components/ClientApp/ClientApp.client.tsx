'use client';
import { AudioContextProvider } from '../../contexts/AudioContext/AudioContext.client';
import { HardwareContextProvider } from '../../contexts/HardwareContext/HardwareContext';
import { MachineContextProvider } from '../../contexts/MachineContext/MachineContext';
import StartController from '../StartController/StartController.client';

// Entry component for our one and only game "page".
// Just renders our general contexts that are always available to all components regardless of game state, then
//  renders the start controller so that it and everything else can use these contexts as needed.
// Order of contexts matters because some contexts require others.  MachineContext uses HardwareContext.
const ClientApp = () => {
	return (
		<AudioContextProvider>
			<HardwareContextProvider>
				<MachineContextProvider>
					<StartController />
				</MachineContextProvider>
			</HardwareContextProvider>
		</AudioContextProvider>
	);
};

export default ClientApp;
