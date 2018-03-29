import { applyMiddleware, createStore }  from "redux";
import thunk from "redux-thunk";
import {rootReducer} from "./reducers/index";

const middleware = applyMiddleware(thunk);

export default (initialState) => {
    return createStore(rootReducer, initialState, middleware)
};