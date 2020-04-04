import {GET_PROFILE , PROFILE_ERROR , CLEAR_PROFILE , UPDATE_PROFILE , GET_PROFILES , GET_REPOS} from '../actions/types';
const initailState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
}

export default function(state = initailState , action) {
    const {type , payload} = action;

    switch (type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false
            }
        case GET_REPOS:
            return {
                ...state,
                repos: payload,
                loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                loading: false,
                error: payload
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                loading: false,
                profile: null,
                repos: []
            }
        default:
            return state;
    }
}