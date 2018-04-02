import * as types from '../actions/actionTypes';

const initialState = {
    staff: {},
};

export default function (state = initialState, action) {
    // if (action.type === types.INVESTIGATION_FETCH_SORT_PARAM) {
    //     return { ...state, sortParams: action.sortParams };
    // }

    //return state;
    if(action.type === types.STAFF_INFO){
        return { ...state, staff: action.record };
    }
    return state;
}
