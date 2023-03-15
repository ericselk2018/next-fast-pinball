'use client';
import { autoStartGamePlayers } from 'const/Setup/Setup';
import engine, { requestPort } from 'engine/engine';
import { useEffect, useState } from 'react';
import { AudioContextProvider } from '../../contexts/AudioContext/AudioContext.client';
import { HardwareContextProvider } from '../../contexts/HardwareContext/HardwareContext';
import { MachineContextProvider } from '../../contexts/MachineContext/MachineContext';
import StartController from '../StartController/StartController.client';

// Entry component for our one and only game "page".
// Just renders our general contexts that are always available to all components regardless of game state, then
//  renders the start controller so that it and everything else can use these contexts as needed.
// Order of contexts matters because some contexts require others.  MachineContext uses HardwareContext.
const ClientApp = () => {
	const [status, setStatus] = useState('loading');
	const [ballsInPlay, setBallsInPlay] = useState(0);
	const [error, setError] = useState('');
	const [requestingPort, setRequestingPort] = useState(false);

	useEffect(() => {
		const abortController = new AbortController();
		engine({
			abortSignal: abortController.signal,
			onStatusChange: setStatus,
			onBallsInPlayChange: setBallsInPlay,
			onErrorChange: setError,
			onRequestPort: () => setRequestingPort(true),
		});
		return () => abortController.abort();
	}, []);

	const handleSelectPortClick = () => {
		requestPort();
		setRequestingPort(false);
	};

	if (!autoStartGamePlayers) {
		if (requestingPort) {
			return (
				<button style={{ fontSize: '200px' }} onClick={handleSelectPortClick}>
					Select Port
				</button>
			);
		}
		return (
			<table style={{ fontSize: '50px' }} cellSpacing={20}>
				<tbody>
					<tr>
						<td>Status</td>
						<td>{status}</td>
					</tr>
					<tr>
						<td>Balls In Play</td>
						<td>{ballsInPlay}</td>
					</tr>
					<tr>
						<td>Error</td>
						<td>{error}</td>
					</tr>
				</tbody>
			</table>
		);
	}
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
