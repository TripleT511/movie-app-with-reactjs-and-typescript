import { createStore } from 'redux';
import rootReducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const composedEnhancers = composeWithDevTools();

const store = createStore(rootReducer, composedEnhancers);
export type RootState = ReturnType<typeof store.getState>;
export default store;
