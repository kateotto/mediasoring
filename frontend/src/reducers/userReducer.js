import { LOGIN_USER, LOGIN_USER_SUCCESS, LOGIN_USER_FAIL, LOGOUT_USER, ABOUT_ME, ABOUT_ME_SUCCESS, ABOUT_ME_FAIL, VALIDATE_TOKEN, VALIDATE_TOKEN_SUCCESS, VALIDATE_TOKEN_FAIL, REFRESH_TOKEN, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAIL, ME_FROM_TOKEN, ME_FROM_TOKEN_SUCCESS, ME_FROM_TOKEN_FAIL, UPDATE_USER_DATA, UPDATE_USER_DATA_SUCCESS, UPDATE_USER_DATA_FAIL } from '../actions/userActions';

const initialState = { id: '',
                       username: '',
                       token: '',
                       is_premium: '',
                       avatar: '',
                       email: '',
                       fetching: false,
                       fetched: false,
                       first_name: '',
                       last_name: '',
                       about: '',
                       error: ''
                    }

const userReducer = (state=initialState, action) => {
    switch(action.type){
        //Login user
        case LOGIN_USER:
            return {...state, fetching: true}
        case LOGIN_USER_SUCCESS:
            return  {...state,
                id: action.payload.user.id,
                username: action.payload.user.username,
                token: action.payload.token,
                avatar: action.payload.user.avatar,
                is_premium: action.payload.user.is_premium_user,
                first_name: action.payload.user.first_name,
                last_name: action.payload.user.last_name,
                email: action.payload.user.email,
                about: action.payload.user.about,
                fetching: false,
                fetched: true,
                error: ''}
        case LOGIN_USER_FAIL:
            return {...state, error: action.payload}
        
        //Logout user
        case LOGOUT_USER:
            return initialState;

        case UPDATE_USER_DATA:
            return {...state, fetching: true}
        case UPDATE_USER_DATA_SUCCESS:
            return {...state,
                avatar: action.payload.avatar,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                email: action.payload.email,
                about: action.payload.about,
                fetching: false,
                fetched: true
            }
        case UPDATE_USER_DATA_FAIL:
            return {...state, fetching: false, fetched: false}
        
        //Get current data about user
        case ABOUT_ME:
            return {...state, fetching: true};
        case ABOUT_ME_SUCCESS:
            return {...state,
                 id: action.payload.id,
                 username: action.payload.username,
                 avatar: action.payload.avatar,
                 is_premium: action.payload.is_premium_user,
                 first_name: action.payload.first_name,
                 last_name: action.payload.last_name,
                 email: action.payload.email,
                 about: action.payload.about,
                 fetched: true,
                 fetching: false};
        case ABOUT_ME_FAIL:
            return {...state, fetching: false, fetched: false};
        
        //VAlidate token
        case VALIDATE_TOKEN:
            return {...state, fetching: true};
        case VALIDATE_TOKEN_SUCCESS:
            return {...state, fetching: false, fetched: true, token: action.payload, error: ''};
        case VALIDATE_TOKEN_FAIL:
            return {...state, fetching: false, fetched: false, error: action.payload};
        
        //Refresh user token
        case REFRESH_TOKEN:
            return state;
        case REFRESH_TOKEN_SUCCESS:
            return state;
        case REFRESH_TOKEN_FAIL:
            return state;

        //Get user data (from token in localsorage) if possible
        case ME_FROM_TOKEN:
            return {...state, fetching: true};
        case ME_FROM_TOKEN_SUCCESS:
            return {...state,
                id: action.payload.user.id,
                username: action.payload.user.username,
                token: action.payload.token,
                avatar: action.payload.user.avatar,
                email: action.payload.user.email,
                is_premium: action.payload.user.is_premium,
                fetching: false,
                fetched: true};
        case ME_FROM_TOKEN_FAIL:
            return initialState;
        
        default: return state;
    }
}

export default userReducer;