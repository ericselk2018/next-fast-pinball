import GameContext from '@/contexts/GameContext/GameContext.client';
import { useContext } from 'react';
import ModeSelect from '../ModeSelect/ModeSelect.client';
import Play from '../Play/Play';

const GameController = () => {
	const { currentMode, ballsInPlay } = useContext(GameContext);
	return ballsInPlay ? <Play mode={currentMode} /> : <ModeSelect />;
};

export default GameController;
