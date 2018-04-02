import * as types from './actionTypes';

export function fetchSortParams(sortParams) {
    return {
        type: types.INVESTIGATION_FETCH_SORT_PARAM,
        sortParams,
    };
}
