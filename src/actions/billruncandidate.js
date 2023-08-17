import {  FETCH_BILLRUN_CAN, UPDATE_BILLRUN_CAN, FETCH_BILLRUN_CAN_BY_ID } from '../constants/actionTypes';
import * as api from '../api/index';

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

    console.log('api.fetchBRCByBRId(id)-reqqqqq:::: ', id); //todododod optimize fetch, fetch by brid AND monthPeriod
    const { data } = await api.fetchBRCByBRId(id);
    console.log('api.fetchBRCByBRId(id)-responseeeee:::: ', data);

    dispatch({ type: FETCH_BILLRUN_CAN_BY_ID, payload: data});
  }
  catch (error) {
    console.log('err: ', error);
  }
};

export const updateBRC = (req, type) => async (dispatch) => {
  try {
    console.log('API-updateBRC-REQ:::: ', req);
    const { data } = await api.updateBRC(req);
    
    dispatch({ type: UPDATE_BILLRUN_CAN, payload: data});

  } catch (error) {
    console.log(error.message);
  }
};
