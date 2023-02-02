import {  FETCH_PLAN, CREATE_PLAN, FETCH_PLAN_BY_CATEGORY_ID } from '../../constants/actionTypes';
import * as api from '../../api/index';

export const createPlan = req => async dispatch => {
    try {

        const { data } = await api.createPlan(req);
        console.log('createPlan-api-resp: ', data);
        dispatch({ type: CREATE_PLAN, payload: data});
        
    } catch (error) {
        console.log('redux-action-plan-category-ERROR: ', error.message);
    }
};

export const getPlanByCategoryId = id => async dispatch => {
  try {
    
    console.log('fetchPlanByCategoryId-REQ: ', id);
    const { data } = await api.fetchPlanByCategoryId(id);
    console.log('fetchPlanByCategoryId-RESP: ', data);

    dispatch({ type: FETCH_PLAN_BY_CATEGORY_ID, payload: data});

  }
  catch (error) {
    console.log('err: ', error);
  }
};

export const getPlan = () => async dispatch => {
    try {

      const { data } = await api.fetchPlan();
      dispatch({ type: FETCH_PLAN, payload: data});

    } catch (error) {
      console.log(error);
    }
};