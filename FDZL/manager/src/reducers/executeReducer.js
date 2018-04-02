import * as types from '../actions/actionTypes';

const initialState = {
    searchParams: {},
};

export default function (state = initialState, action) {
    if (action.type === types.SEARCH_PARAMS_SET) {
        return { ...state, searchParams: { ...state.searchParams, [action.moduleDefineCode]: action.params } };
    }else if(action.type === types.CLEAR_SEARCH){
        return initialState
    }
    return state;
}
