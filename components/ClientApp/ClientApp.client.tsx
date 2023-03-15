'use client';
import modes from 'const/Modes/Modes';
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
	const [currentPlayerId, setCurrentPlayerId] = useState(0);
	const [ballsUsedPerPlayer, setBallsUsedPerPlayer] = useState<number[]>([]);
	const [requestingPort, setRequestingPort] = useState(false);
	const [currentModeId, setCurrentModeId] = useState(0);
	const currentMode = modes[currentModeId];

	useEffect(() => {
		const abortController = new AbortController();
		engine({
			abortSignal: abortController.signal,
			onStatusChange: setStatus,
			onBallsInPlayChange: setBallsInPlay,
			onErrorChange: setError,
			onCurrentPlayerIdChange: setCurrentPlayerId,
			onBallsUsedPerPlayerChange: setBallsUsedPerPlayer,
			onCurrentModeIdChange: setCurrentModeId,
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
						<td>Current Player ID</td>
						<td>{currentPlayerId}</td>
					</tr>
					<tr>
						<td>Balls Used Per Player</td>
						<td>{ballsUsedPerPlayer.join(', ')}</td>
					</tr>
					<tr>
						<td>Current Mode</td>
						<td>{currentMode.name}</td>
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
