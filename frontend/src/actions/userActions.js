import axios from 'axios';

const ROOT_URL = 'http://127.0.0.1:8001/api';

export const LOGIN_USER = 'LOGIN_USER';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAIL = 'LOGIN_USER_FAIL';

export const LOGOUT_USER = 'LOGOUT_USER';

export const REGISTER_USER = 'REGISTER_USER';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCES';
export const REGISTER_USER_FAIL = 'REGISTER_USER_FAIL';

export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
export const UPDATE_USER_DATA_SUCCESS = 'UPDATE_USER_DATA_SUCCESS';
export const UPDATE_USER_DATA_FAIL = 'UPDATE_USER_DATA_FAIL';

export const ABOUT_ME = 'ABOUT_ME';
export const ABOUT_ME_SUCCESS = 'ABOUT_ME_SUCCESS';
export const ABOUT_ME_FAIL = 'ABOUT_ME_FAIL';

export const VALIDATE_TOKEN = 'VALIDATE_TOKEN';
export const VALIDATE_TOKEN_SUCCESS = 'VALIDATE_TOKEN_SUCCESS';
export const VALIDATE_TOKEN_FAIL = 'VALIDATE_TOKEN_FAIL';

export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_FAIL = 'REFRESH_TOKEN_FAIL';

export const ME_FROM_TOKEN = 'ME_FROM_TOKEN';
export const ME_FROM_TOKEN_SUCCESS = 'ME_FROM_TOKEN_SUCCESS';
export const ME_FROM_TOKEN_FAIL = 'ME_FROM_TOKEN_FAIL';

export function login(username, password) {
    return (dispatch) => {
        dispatch({type: LOGIN_USER});
        axios.post(ROOT_URL + '/users/login/', {
            username:username,
            password:password
        }).then(res => {
            const data = res.data;
            localStorage.setItem('JWTToken', data.token);
            dispatch({type: LOGIN_USER_SUCCESS, payload: data})
        }).catch(err => {
            dispatch({type: LOGIN_USER_FAIL, payload: err.response.data.non_field_errors})
        })
    }
}

export function logout(){
    return (dispatch) => {
        axios.post(ROOT_URL + '/users/logout/', {}).then(res => {
            if(res.status === 200){
                localStorage.clear();
                dispatch({type: LOGOUT_USER})
            }
        })
    }
}

export function updateData(data){
    return (dispatch) => {
        dispatch({type: UPDATE_USER_DATA})
        axios(ROOT_URL + '/users/me/', {
            method: 'PATCH',
            data: data,
            headers: {
                'Authorization': 'JWT '+ localStorage.getItem('JWTToken')
            }}).then(res => {
            let newData = res.data;
            dispatch({type: UPDATE_USER_DATA_SUCCESS, payload: newData})
        }).catch(() => {dispatch({type: UPDATE_USER_DATA_FAIL})})
    }
}

export function about_me(){
    return (dispatch) => {
        dispatch({type: ABOUT_ME})
        axios.get(ROOT_URL + '/users/me/', {
            headers: {
                'Authorization': 'JWT '+ localStorage.getItem('JWTToken')
              }
        }).then(res => {
                let data = res.data;
                dispatch({type: ABOUT_ME_SUCCESS, payload: data})
        }).catch(() => {dispatch({type: ABOUT_ME_FAIL})})
    }
}

export function refresh_token(token){
    return (dispatch) => {
        dispatch({type: REFRESH_TOKEN})
        axios.post(ROOT_URL + '/token/refresh', {
            token: token
        }).then(res => {
            localStorage.setItem('JWTToken', res.data)
            dispatch({type: REFRESH_TOKEN_SUCCESS, payload: res.data})
        }).catch(err => {
            localStorage.clear();
            dispatch({type: REFRESH_TOKEN_FAIL, payload: err.response.data.non_field_errors})
        })
    }
}

export function validate_token(token){
    return (dispatch) => {
        dispatch({type: VALIDATE_TOKEN})
        axios.post(ROOT_URL + '/token/verify', {
            token: token
        }).then(res => {
            dispatch({type: VALIDATE_TOKEN_SUCCESS, payload: res.data})
        }).catch(err => {
            localStorage.clear()
            dispatch({type: VALIDATE_TOKEN_FAIL, payload: err.response.data.non_field_errors})
        })
    }
}

export function me_from_token(token){
    return (dispatch) => {
        dispatch({type: ME_FROM_TOKEN})
        axios.get(ROOT_URL + '/users/me/', {
            headers: {
                'Authorization': 'JWT '+ token
              }
        }).then(res => {
            dispatch({type: ME_FROM_TOKEN_SUCCESS, payload: res.data})
        }).catch(() => {
            dispatch({type: ME_FROM_TOKEN_FAIL})
            localStorage.clear()
        })
    }
}