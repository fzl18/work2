import * as types from './actionTypes';

export function setSearchParams(moduleDefineCode, params) {
    return {
        type: types.SEARCH_PARAMS_SET,
        moduleDefineCode,
        params,
    };
}

export function clearSearch() {
    return {
        type: types.CLEAR_SEARCH
    };
}
