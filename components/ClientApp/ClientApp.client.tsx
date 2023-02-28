'use client';
import { AudioContextProvider } from '@/contexts/AudioContext/AudioContext.client';
import { HardwareContextProvider } from '@/contexts/HardwareContext/HardwareContext';
import StartController from '../StartController/StartController.client';

const ClientApp = () => {
	return (
		<AudioContextProvider>
			<HardwareContextProvider>
				<StartController />
			</HardwareContextProvider>
		</AudioContextProvider>
	);
};

export default ClientApp;
