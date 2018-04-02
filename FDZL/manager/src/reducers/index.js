import { combineReducers } from 'redux';
import investigationReducer from './investigationReducer';
import executeReducer from './executeReducer';
import staffReducer from './staffReducer';

const reducers = combineReducers({
    investigationState: investigationReducer,
    executeState: executeReducer,
    staffInfo: staffReducer
});

export default reducers;
