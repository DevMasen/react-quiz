function Options({ question, answer, dispatch }) {
	const hasAnswer = answer !== null;
	return (
		<ul className="options">
			{question.options.map((option, index) => (
				<button
					className={`btn btn-option ${
						index === answer ? 'answer' : ''
					} ${hasAnswer ? (index === question.correctOption ? 'correct' : 'wrong') : ''}`}
					key={option}
					onClick={() =>
						dispatch({ type: 'newAnswer', payload: index })
					}
					disabled={hasAnswer}
				>
					{option}
				</button>
			))}
		</ul>
	);
}

export default Options;
