import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import reducer from './reducer.js';

const store = createStore(
    reducer,
    applyMiddleware(logger)
);

export default store;