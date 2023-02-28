'use client';
import { AudioContextProvider } from '@/contexts/AudioContext/AudioContext.client';
import { HardwareContextProvider } from '@/contexts/HardwareContext/HardwareContext';
import { MachineContextProvider } from '@/contexts/MachineContext/MachineContext';
import StartController from '../StartController/StartController.client';

const ClientApp = () => {
	return (
		<AudioContextProvider>
			<MachineContextProvider>
				<HardwareContextProvider>
					<StartController />
				</HardwareContextProvider>
			</MachineContextProvider>
		</AudioContextProvider>
	);
};

export default ClientApp;
