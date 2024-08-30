const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case LOGIN_SUCCESS:
        return {
          ...state,
          user: action.payload,
          isAuthenticated: true,
          loading: false,
          error: null,
        };
      case LOGIN_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case LOGOUT:
        return {
          ...state,
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        };
      default:
        return state;
    }
  };
  
  export default authReducer;

