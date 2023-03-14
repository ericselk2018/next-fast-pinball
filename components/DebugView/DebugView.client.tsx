import { coinDoorSwitch } from 'const/Switches/Switches';
import GameContext from 'contexts/GameContext/GameContext.client';
import MachineContext from 'contexts/MachineContext/MachineContext';
import { useGameState } from 'lib/state/state';
import { useToggleSwitches } from 'lib/switch/switch';
import { useContext } from 'react';
import * as S from './DebugView.styles';

const DebugView = () => {
	const {
		currentMode,
		currentModeStep,
		currentPlayer,
		kickersWithBalls,
		modeComplete,
		nextPlayer,
		waitingForLaunch,
		tasksCompleted,
	} = useContext(GameContext);
	const { ballsInPlay } = useContext(MachineContext);
	const [showing, setShowing] = useGameState(true);

	useToggleSwitches(
		({ closed }) => {
			setShowing(!closed);
		},
		[setShowing],
		[coinDoorSwitch]
	);

	if (!showing) {
		return null;
	}

	return (
		<S.Container>
			<S.Table>
				<tbody>
					<tr>
						<td>Balls In Play</td>
						<td>{ballsInPlay}</td>
					</tr>
					<tr>
						<td>Current Mode</td>
						<td>{currentMode.name}</td>
					</tr>
					<tr>
						<td>Current Step</td>
						<td>{currentModeStep?.name}</td>
					</tr>
					<tr>
						<td>Completed Tasks This Step</td>
						<td>{currentModeStep && currentModeStep.completedSwitches.map((s) => s.name).join(', ')}</td>
					</tr>
					<tr>
						<td>Tasks Completed</td>
						<td>{tasksCompleted.map((s) => s.step + '=' + s.switchId).join(', ')}</td>
					</tr>
					<tr>
						<td>Current Player ID</td>
						<td>{currentPlayer.id}</td>
					</tr>
					<tr>
						<td>Next Player ID</td>
						<td>{nextPlayer.id}</td>
					</tr>
					<tr>
						<td>Kickers With Balls</td>
						<td>{kickersWithBalls.map((k) => k.name).join(', ')}</td>
					</tr>
					<tr>
						<td>Mode Complete</td>
						<td>{modeComplete ? 'yes' : 'no'}</td>
					</tr>
					<tr>
						<td>Waiting For Launch</td>
						<td>{waitingForLaunch ? 'yes' : 'no'}</td>
					</tr>
				</tbody>
			</S.Table>
		</S.Container>
	);
};

export default DebugView;
