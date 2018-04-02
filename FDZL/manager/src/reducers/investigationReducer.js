import * as types from '../actions/actionTypes';

const initialState = {
    sortParams: {},
};

export default function (state = initialState, action) {
    if (action.type === types.INVESTIGATION_FETCH_SORT_PARAM) {
        return { ...state, sortParams: action.sortParams };
    }

    return state;
}
