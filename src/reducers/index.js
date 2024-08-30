import { combineReducers } from "redux";
import authReducer from "./authReducer";

const reducers = combineReducers({
    authReducer: authReducer,
})

export default reducers;