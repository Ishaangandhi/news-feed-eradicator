import { h } from 'snabbdom/h';
import { currentQuote } from '../store/selectors';
import {
	ActionObject,
} from '../store/actions';
import { Store } from '../store';


const CountDisplay = (store: Store) => {
	const state = store.getState();
	const quote = currentQuote(state);

	if (quote == null) return null;

	return h('div.nfe-count', [
		h('div', [
			h('span', "You have visited Facebook "),
			h('span', state.visitCount),
			h('span', state.visitCount == 1 ? " time today." : " times today."),
		]),
	]);
};

export default CountDisplay;
