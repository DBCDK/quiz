import {createStore, applyMiddleware, compose} from 'redux';
import {root} from './reducers';
import thunk from 'redux-thunk';
import * as actions from './actions';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(root, composeEnhancers(applyMiddleware(thunk)));
store.dispatch(actions.init());
export default store;
