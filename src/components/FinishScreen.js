function FinishScreen({ points, maxPossibelPoints, highscore, dispatch }) {
	const percentage = (points / maxPossibelPoints) * 100;
	let imogi;
	if (percentage === 100) imogi = '🥇';
	if (percentage > 80 && percentage < 100) imogi = '🎉';
	if (percentage > 50 && percentage <= 80) imogi = '🙃';
	if (percentage > 0 && percentage <= 50) imogi = '🤨';
	if (percentage === 0) imogi = '🤦‍♂️';
	return (
		<>
			<p className="result">
				{imogi}
				You Scored <strong>{points}</strong> out of{' '}
				<strong>{maxPossibelPoints}</strong> ({Math.ceil(percentage)}%)
			</p>
			<p className="highscore">( Highscore: {highscore} points )</p>

			<button
				className="btn btn-ui"
				onClick={() => dispatch({ type: 'reset' })}
			>
				Restart quiz
			</button>
		</>
	);
}

export default FinishScreen;
