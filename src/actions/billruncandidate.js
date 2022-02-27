import {  FETCH_BILLRUN_CAN, UPDATE_BILLRUN_CAN, FETCH_BILLRUN_CAN_BY_ID } from '../constants/actionTypes';
import * as api from '../api/index';

export const getBillrunCandidate = () => async dispatch => {
    try {

      const { data } = await api.fetchBillrunCan();

      dispatch({ type: FETCH_BILLRUN_CAN, payload: data});

    } catch (error) {
      console.log(error);
    }
};

export const getBRCById = id => async dispatch => {
  try {

    const { data } = await api.fetchBRCById(id);

    dispatch({ type: FETCH_BILLRUN_CAN_BY_ID, payload: data});

  }
  catch (error) {
    console.log('err: ', error);
  }
};

export const updateBRC = (req) => async (dispatch) => {
  try {
    console.log('updateBRCupdateBRCupdateBRC:::: ', req);
    const { data } = await api.updateBRC(req);
    // //console.log('action/action/updatePost payload data: ', data);
    dispatch({ type: UPDATE_BILLRUN_CAN, payload: data});

  } catch (error) {
    console.log(error.message);
  }
};
