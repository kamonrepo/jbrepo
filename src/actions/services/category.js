import {  FETCH_CATEGORY, CREATE_CATEGORY } from '../../constants/actionTypes';
import * as api from '../../api/index';

export const createCategory = req => async dispatch => {
    try {

   
        const { data } = await api.createCategory(req);
        dispatch({ type: CREATE_CATEGORY, payload: data});
        
    } catch (error) {
        console.log('redux-action-create-category-ERROR: ', error.message);
    }
};

export const getCategory = () => async dispatch => {
    try {

      const { data } = await api.fetchCategory();
      dispatch({ type: FETCH_CATEGORY, payload: data});

    } catch (error) {
      console.log(error);
    }
};