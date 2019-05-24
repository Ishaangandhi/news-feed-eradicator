import handleError from './handle-error';
import { createStore } from '../store';
import { incrementCount, zeroCount, logLogin } from '../store/actions';
import NewsFeedEradicator from '../components/index';

import { init } from 'snabbdom';
import { h } from 'snabbdom/h';
import propsModule from 'snabbdom/modules/props';
import attrsModule from 'snabbdom/modules/attributes';
import eventsModule from 'snabbdom/modules/eventlisteners';
import { toVNode } from 'snabbdom/tovnode';

const storePromise = createStore();

export function isAlreadyInjected() {
	return document.querySelector('#nfe-container') != null;
}

export default function injectUI(streamContainer: Element) {
	var nfeContainer = document.createElement('div');
	nfeContainer.id = 'nfe-container';
	streamContainer.appendChild(nfeContainer);

	const patch = init([propsModule, attrsModule, eventsModule]);

	let vnode = toVNode(nfeContainer);

	storePromise
		.then(store => {
			const render = () => {
				const newVnode = h('div#nfe-container', [NewsFeedEradicator(store)]);
				patch(vnode, newVnode);
				vnode = newVnode;
			};

			// increment the visit count every time we load NFE
			var state = store.getState();
			var d = new Date();
			if (d.getDate() != state.lastLogin) {
				// its a new day, reset the clock
				store.dispatch(zeroCount());
				store.dispatch(logLogin());
			}
			store.dispatch(incrementCount());

			render();
			store.subscribe(render);
		})
		.catch(handleError);
}
