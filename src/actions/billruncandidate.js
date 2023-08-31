import {  FETCH_BILLRUN_CAN, UPDATE_BILLRUN_CAN, FETCH_BILLRUN_CAN_BY_ID } from '../constants/actionTypes';
import * as api from '../api/index';

export const computeFees = (req) => async dispatch => {
  try {

    const { data } = await api.computeFees(req);
    console.log('computeFees-RESPONSE::: ', data);

    dispatch({ type: FETCH_BILLRUN_CAN, payload: data});

  } catch (error) {
    console.log(error);
  }
};

export const getBillrunCandidate = () => async dispatch => {
    try {

      const { data } = await api.fetchBillrunCan();
      console.log('fetch-billrun-candid-RESPONSE::: ', data);

      dispatch({ type: FETCH_BILLRUN_CAN, payload: data});

    } catch (error) {
      console.log(error);
    }
};


export const getBRCByBRId = id => async dispatch => {
  try {

    const { data } = await api.fetchBRCByBRId(id);

    dispatch({ type: FETCH_BILLRUN_CAN_BY_ID, payload: data});
  }
  catch (error) {
    console.log('err: ', error);

  }
};

export const updateBRC = (req, type) => async (dispatch) => {
  try {

    const { data } = await api.updateBRC(req);
    
    dispatch({ type: UPDATE_BILLRUN_CAN, payload: data});

  } catch (error) {
    console.log(error.message);
  }
};
