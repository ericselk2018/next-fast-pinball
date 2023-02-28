import GameContext from '@/contexts/GameContext/GameContext.client';
import { useContext } from 'react';
import ModeSelect from '../ModeSelect/ModeSelect.client';
import Play from '../Play/Play';

const GameController = () => {
	const { activeMode } = useContext(GameContext);
	return activeMode ? <Play mode={activeMode} /> : <ModeSelect />;
};

export default GameController;
