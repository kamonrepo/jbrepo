import {  START_LOADING_GETDATALOC, END_LOADING_GETDATALOC, FETCH_AND_GENERATE } from '../constants/actionTypes';
import * as api from '../api/index';

export const getDataLocation = (req) => async dispatch => {
  try {

    dispatch({ type: START_LOADING_GETDATALOC });
    const { data } = await api.getDataLocation(req);

    dispatch({ type: FETCH_AND_GENERATE, payload: data});
    dispatch({ type: END_LOADING_GETDATALOC });

  } catch (error) {
    console.log(error);
  }
};
