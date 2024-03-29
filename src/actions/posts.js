import { FETCH_POSTS, CREATE, UPDATE, DELETE, LIKE, FETCH, FETCH_BY_SEARCH, START_LOADING_POSTS, END_LOADING_POSTS, COMMENT } from '../constants/actionTypes';
import * as api from '../api/index.js';


export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_POSTS });
    const { data } = await api.fetchPost(id);

    dispatch({ type: FETCH, payload: data});
    dispatch({ type: END_LOADING_POSTS });
  }
  catch (error) {
    console.log('client>src>action>posts>getPost ERROR: ', error);
  }
};

export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_POSTS });
    const { data } = await api.fetchPosts(page);
    
    dispatch({ type: FETCH_POSTS, payload: data });
    dispatch({ type: END_LOADING_POSTS });
  } catch (error) {
    console.log('client>src>action>posts>getPosts: ', error);
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {

  try {
    dispatch({ type: START_LOADING_POSTS });
    console.log('getPostsBySearch-dispatch-START_LOADING-searchQuery: ', searchQuery);

    const { data: { data } } = await api.fetchPostsBySearch(searchQuery);

        dispatch({ type: FETCH_BY_SEARCH, payload: data });
        dispatch({ type: END_LOADING_POSTS });
        
        console.log('getPostsBySearch-dispatch-END_LOADING: ');

  } catch(error) {

    console.log('getPostsBySearch error: ', error)
  }
}
//accept the history object that came from the front end
export const createPost = (post, history) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING_POSTS });
    console.log('createPost done-dispatch-START_LOADING: ');
    const { data } = await api.createPost(post);
    history.push(`/posts/${data._id}`)
    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {

    const { data } = await api.updatePost(id, post);
    
    //console.log('action/action/updatePost payload data: ', data);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = (id) => async (dispatch) => {
  const user = JSON.parse(localStorage.getItem('profile'));

  try {
    const { data } = await api.likePost(id, user?.token);

    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const commentPost = (value, id) => async (dispatch) => {
  try{
  
    const { data } = await api.comment(value, id);
    //we are expecting that this data, if front end send a correct data ,
    //that means that this data should return a new post, and
    //that post should have that comments on array, and it should have that comment that the user typed in
    console.log('WARARARARAR:::: ', data)
    dispatch({ type: COMMENT, payload: data});

    //return the newest commetns thats coming in
    return data.comments;

  } catch (error) {
    console.log(error)
  }
}

export const deletePost = (id) => async (dispatch) => {
  try {
      await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error);
  }
};
