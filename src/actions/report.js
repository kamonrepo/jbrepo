import {  START_LOADING_GETDATALOC, END_LOADING_GETDATALOC, GET_DATA_LOCATION } from '../constants/actionTypes';
import * as api from '../api/index';

export const getDataLocation = (req) => async dispatch => {
  try {

    dispatch({ type: START_LOADING_GETDATALOC });
    const { data } = await api.getDataLocation(req);

    dispatch({ type: GET_DATA_LOCATION, payload: data});
    dispatch({ type: END_LOADING_GETDATALOC });

  } catch (error) {
    console.log(error);
  }
};
