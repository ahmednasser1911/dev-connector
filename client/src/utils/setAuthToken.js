import axios from 'axios';

// check if there is a token in local storage then put it in global header evry time the app runs
const setAuthToken = (token) => {
    if(token){
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;