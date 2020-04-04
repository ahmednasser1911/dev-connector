import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    DELETE_COMMENT
} from './types';
import { setAlert } from './alert';
import axios from 'axios'

// get all posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts')
        console.log(res.data)
        dispatch({
            type: GET_POSTS,
            payload: res.data // posts
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });
    }
}

// Like a post
export const addLike = postID => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postID}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: { postID , likes: res.data }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });
    }
}

// UnLike a post
export const removeLike = postID => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postID}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: { postID , likes: res.data }
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });
    }
}

// remove post
export const deletePost = postID => async dispatch => {
    try {
        await axios.delete(`/api/posts/${postID}`)
        dispatch({
            type: DELETE_POST,
            payload: postID
        })

        dispatch(setAlert('Post Removed' , 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });
    }
}

// Add a post
export const addPost = formData => async dispatch => {
    const config = {
        headers : {
            'Content-Type': 'application/json'
        }
    }
    
    try {
        const res = await axios.post(`/api/posts`, formData , config)
        dispatch({
            type: ADD_POST,
            payload: res.data
        })
        dispatch(setAlert('Post Uploaded' , 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });
    }
}

// get post
export const getPost = postID => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${postID}`)
        dispatch({
            type: GET_POST,
            payload: res.data // post
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });
    }
}

// add comment
export const addComment = (postID , formData) => async dispatch => {
    const config = {
        headers : {
            'Content-Type': 'application/json'
        }
    }
    
    try {
        const res = await axios.post(`/api/posts/comment/${postID}`, formData , config)
        dispatch({
            type: ADD_COMMENT,
            payload: res.data // comments arr
        })
        dispatch(setAlert('You added a comment' , 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });
    }
}

// add comment
export const deleteComment = (postID , commentID) => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/comment/${postID}/${commentID}`)
        dispatch({
            type: DELETE_COMMENT,
            payload: commentID 
        })
        dispatch(setAlert('You added a comment' , 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {msg :  err.response.statusText , status: err.response.status}
        });
    }
}