import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
const initialState = {
	questions: [],

	// status: loading, error, ready, active, finished
	status: 'loading',
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
		default:
			return new Error('Unknown Action!');
	}
}

export default function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	console.log(state);
	useEffect(function () {
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
		getQuestions();
	}, []);
	return (
		<div className="app">
			<Header />
			<Main>
				<p>1/15</p>
				<p>question?</p>
			</Main>
		</div>
	);
}
