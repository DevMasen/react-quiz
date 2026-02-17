import { createContext, useContext, useReducer } from 'react';

const SECS_PER_QUESTION = 30;

const QuizContext = createContext();

const initialState = {
	questions: [],
	// status: loading, error, ready, active, finished
	status: 'loading',
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
	secondsRemaining: 0,
};

function reducer(state, action) {
	switch (action.type) {
		case 'dataReceived':
			return {
				...state,
				questions: action.payload,
				status: 'ready',
			};
		case 'dataFailed':
			return {
				...state,
				status: 'error',
			};
		case 'start':
			return {
				...state,
				status: 'active',
				secondsRemaining: state.questions.length * SECS_PER_QUESTION,
			};
		case 'newAnswer':
			const question = state.questions.at(state.index);
			return {
				...state,
				answer: action.payload,
				points:
					question.correctOption === action.payload
						? state.points + question.points
						: state.points,
			};
		case 'nextQuestion':
			return {
				...state,
				index: state.index + 1,
				answer: null,
			};
		case 'finish':
			return {
				...state,
				status: 'finished',
				highscore:
					state.points > state.highscore
						? state.points
						: state.highscore,
			};
		case 'reset':
			return {
				...initialState,
				questions: state.questions,
				status: 'ready',
				highscore: state.highscore,
			};
		case 'tick':
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status:
					state.secondsRemaining === 0 ? 'finished' : state.status,
			};
		default:
			return new Error('Unknown Action!');
	}
}

function QuizProvider({ children }) {
	const [
		{
			questions,
			status,
			index,
			answer,
			points,
			highscore,
			secondsRemaining,
		},
		dispatch,
	] = useReducer(reducer, initialState);

	const question = questions[index];
	const numQuestions = questions.length;
	const maxPossiblePoints = questions.reduce(
		(prev, cur) => prev + cur.points,
		0,
	);
	// console.log(typeof maxPossiblePoints);

	async function getQuestions() {
		try {
			const res = await fetch('http://localhost:8000/questions');
			if (!res.ok) {
				throw new Error('Error!');
			}
			const data = await res.json();
			dispatch({ type: 'dataReceived', payload: data });
		} catch (err) {
			dispatch({ type: 'dataFailed' });
		}
	}

	return (
		<QuizContext.Provider
			value={{
				questions,
				question,
				numQuestions,
				maxPossiblePoints,
				status,
				index,
				answer,
				points,
				highscore,
				secondsRemaining,
				dispatch,
				getQuestions,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
}

function useQuiz() {
	const context = useContext(QuizContext);
	if (context === undefined)
		throw new Error('QuizContext used outside of QuizProvider');
	return context;
}

export { QuizProvider, useQuiz };
