import GameContext from '@/contexts/GameContext/GameContext.client';
import { useContext, useEffect, useRef } from 'react';
import * as S from './GameStatus.styles';

const GameStatus = () => {
	const { players } = useContext(GameContext);

	return (
		<S.Container>
			<S.Players>
				{players.map((player, index) => {
					const { score, usedBalls, totalBalls } = player;
					return (
						<S.Player key={index}>
							<S.Score>{score}</S.Score>
							<S.Balls>
								{usedBalls}/{totalBalls}
							</S.Balls>
						</S.Player>
					);
				})}
			</S.Players>
			<S.Points>+100,000 Combo Shot Bonus</S.Points>
		</S.Container>
	);
};

export default GameStatus;
