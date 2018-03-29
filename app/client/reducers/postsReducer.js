import { combineReducers } from 'redux'
import {
  SORT_POSTS, RECIEVE_POSTS
} from '../actions/actions'

export default function reducer(state={
    posts: [],
    sortBy: 'releaseDate',
}, action){
  switch (action.type){
      case RECIEVE_POSTS: {
          return Object.assign({}, state, { posts: action.posts });
      }
      case SORT_POSTS: {
           return Object.assign({}, state, { sortBy: action.sortBy });
      }
      default: return state;
  }
}