const path = 'http://localhost:3000';

export const SORT_POSTS = "SORT_POSTS";
export const RECIEVE_POSTS = "RECIEVE_POSTS";

function fetchPosts (url, dispatch){
    return fetch(url)
    .then(
        response => response.json().then(
            json => dispatch(recievePosts(json))
        )
    )
}

function fetchAddPost (url, data, dispatch){
    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then(
        response => dispatch(getPosts())
    )
}

function fetchRemovePost (url, id, dispatch){
    return fetch(url, {
        method: 'DELETE',
        body: id,
    })
    .then(
        response => dispatch(getPosts())
    )
}

export function getPosts (){
    return (dispatch, getState) => {
        return fetchPosts(`${path}/blogs`, dispatch);
    }
}

export function addPost(data){
    return (dispatch, getState) => {
        return fetchAddPost(`${path}/blogs`, data, dispatch)
    }
}

export function removePost(id){
    return (dispatch, getState) => {
        return fetchRemovePost(`${path}/blogs/${id}`, id, dispatch)
    }
}

function recievePosts(posts) {
  return {
    type: RECIEVE_POSTS,
    posts
  }
}

export function sortPost(sortBy) {
  return {
    type: SORT_POSTS,
    sortBy
  }
}