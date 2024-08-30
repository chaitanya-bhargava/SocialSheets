const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';

export const loginRequest = () => ({
    type: LOGIN_REQUEST,
  });
  
  // Action Creator for Login Success
  export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user,
  });
  
  // Action Creator for Login Failure
  export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
  });
  
  // Action Creator for Logout
  export const logout = () => ({
    type: LOGOUT,
  });