'use client';
import { AudioContextProvider } from '@/contexts/AudioContext/AudioContext.client';
import { HardwareContextProvider } from '@/contexts/HardwareContext/HardwareContext';
import { MachineContextProvider } from '@/contexts/MachineContext/MachineContext';
import StartController from '../StartController/StartController.client';

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
