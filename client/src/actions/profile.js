import axios from "axios";

import {
    PROFILE_ERROR,
    GET_PROFILE,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
    GET_PROFILES,
    GET_REPOS
} from './types';
import { connect } from "react-redux";
import {setAlert} from '../actions/alert';

// get current profile
export const getProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data // profile
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });

    }
}

export const createProfile = (formData , history ,edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify(formData);
        const res = await axios.post('/api/profile' , body, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

        dispatch(setAlert(!edit ? 'Profile Created' : 'Profile Updated' , 'success'));
        // if create-profile
        if(!edit)
            history.push('/dashboard')

    } catch(err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => {
                dispatch(setAlert(error.msg , 'danger'));
            });
        }
    }
}

// Add experience
export const addExperience = (formData , history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify(formData);
        const res = await axios.put('/api/profile/experience' , body, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experience Added' , 'success'));
        history.push('/dashboard')

    } catch(err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => {
                dispatch(setAlert(error.msg , 'danger'));
            });
        }
    }
}

// Add education
export const addEducation = (formData , history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify(formData);
        const res = await axios.put('/api/profile/education' , body, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Education Added' , 'success'));
        history.push('/dashboard')

    } catch(err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => {
                dispatch(setAlert(error.msg , 'danger'));
            });
        }
    }
}

// Delete Experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience Deleted' , 'danger'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });
    }
}

// Delete Education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Education Deleted' , 'danger'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });
    }
}

// Delete Auth Account
export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure?')){
        try {
            await axios.delete(`/api/profile`);
            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: ACCOUNT_DELETED });
            dispatch(setAlert('Your Account has been Deleted'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg :  err.response.statusText , status: err.response.status}
            });
        }
    }
   
}

// get all profiles
export const getProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    try {
        const res = await axios.get('/api/profile');

        dispatch({
            type: GET_PROFILES,
            payload: res.data // profiles
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });

    }
}

// get profile by user id
export const getProfileById = userId => async dispatch => {
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data // profile
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });

    }
}

// get github repos
export const getGitHubRepos = username => async dispatch => {
    try {
        const res = await axios.get(`/api/profile/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data // Repos
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });

    }
}