import {combineReducers} from "redux";

import userReducer from "./userReducer";
import postsReducer from "./postsReducer";

console.log(userReducer);
console.log(postsReducer);

export const rootReducer = combineReducers({
    storeUser: userReducer,
    storePosts: postsReducer
});




