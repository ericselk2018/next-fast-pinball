import modes from '@/const/Modes/Modes';
import { inlaneSwitch } from '@/const/Switches/Switches';
import Game from '@/entities/Game/Game';
import Mode from '@/entities/Mode/Mode';
import { createContext, ReactNode, useMemo, useState } from 'react';
import { useSwitchHit } from '../HardwareContext/HardwareContext';

interface GameContext {
	game: Game;
	activeModeIndex: number;
	setActiveModeIndex: (value: number) => void;
	ballsInPlay: number;
	activeMode: Mode | undefined;
}

const GameContext = createContext<GameContext>(null!);

export const GameContextProvider = ({ children, playerCount }: { children: ReactNode; playerCount: number }) => {
	const [_game, setGame] = useState<Game>();
	const [activeModeIndex, setActiveModeIndex] = useState(0);
	const [ballsInPlay, setBallsInPlay] = useState(0);

	useSwitchHit({
		switch: inlaneSwitch,
		onHit: () => {
			setBallsInPlay((ballsInPlay) => ballsInPlay + 1);
		},
	});

	const activeMode = useMemo(
		() => (ballsInPlay ? modes[activeModeIndex] : undefined),
		[activeModeIndex, ballsInPlay]
	);

	const game = useMemo(() => _game || new Game({ playerCount, update: setGame }), [_game, playerCount]);

	const context: GameContext = useMemo(
		() => ({
			game,
			activeModeIndex,
			setActiveModeIndex,
			ballsInPlay,
			activeMode,
		}),
		[activeMode, activeModeIndex, ballsInPlay, game]
	);

	return <GameContext.Provider value={context}>{children}</GameContext.Provider>;
};

export default GameContext;
