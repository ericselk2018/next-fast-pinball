import GameContext from '../../contexts/GameContext/GameContext.client';
import { useContext } from 'react';
import * as S from './GameStatus.styles';

// Displays game status: Points, active player, shots hit, ball info.
const GameStatus = () => {
	const { players, currentPlayer, shots } = useContext(GameContext);

	return (
		<S.Container>
			<S.Players>
				<>
					{players.map((player, index) => {
						const { score, usedBalls, totalBalls } = player;
						return (
							<S.Player key={index} active={player.id === currentPlayer.id}>
								<S.Score>{score.toLocaleString()}</S.Score>
								<S.Balls>
									<img src="images/ball.png" />
									<div>
										{usedBalls}/{totalBalls}
									</div>
								</S.Balls>
							</S.Player>
						);
					})}
					<S.CurrentPlayerInitials>{currentPlayer.initials}</S.CurrentPlayerInitials>
				</>
			</S.Players>
			<S.Shots>
				{shots.map((shot, index) => {
					const { name, points } = shot;
					return (
						index + 11 > shots.length && (
							<S.Shot key={index} styleNumber={index % 3}>
								+{points.toLocaleString()} {name}
							</S.Shot>
						)
					);
				})}
			</S.Shots>
		</S.Container>
	);
};

export default GameStatus;
