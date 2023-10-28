import {  START_LOADING_CLBRC, END_LOADING_CLBRC, FETCH_CHECK_LATEST_BRC, START_LOADING, END_LOADING, FETCH_BILLRUN_CAN_BY_MP, FETCH_BILLRUN_CAN, UPDATE_BILLRUN_CAN, FETCH_BILLRUN_CAN_BY_ID, FETCH_COMPUTED_FEES } from '../constants/actionTypes';
import * as api from '../api/index';

export const checkLatestBRC = (req) => async dispatch => {
  try {

    dispatch({ type: START_LOADING_CLBRC });
    const { data } = await api.checkLatestBRC(req);

    dispatch({ type: FETCH_CHECK_LATEST_BRC, payload: data});
    console.log('backend-api-response-checkLatestBRC::: ', data);
    dispatch({ type: END_LOADING_CLBRC });

  } catch (error) {
    console.log(error);
  }
};

export const computeFees = (req) => async dispatch => {
  try {

    dispatch({ type: START_LOADING });
    const { data } = await api.computeFees(req);

    dispatch({ type: FETCH_COMPUTED_FEES, payload: data});
    dispatch({ type: END_LOADING });

  } catch (error) {
    console.log(error);
  }
};

export const getBillrunCandidate = () => async dispatch => {
    try {

      const { data } = await api.fetchBillrunCan();

      dispatch({ type: FETCH_BILLRUN_CAN, payload: data});

    } catch (error) {
      console.log(error);
    }
};


export const getBRCByBRId = id => async dispatch => {
  try {

    //dispatch start/end loading here...
    const { data } = await api.fetchBRCByBRId(id);

    dispatch({ type: FETCH_BILLRUN_CAN_BY_ID, payload: data});
  }
  catch (error) {
    console.log('err: ', error);

  }
};

export const getBRCByMonthPeriod = req => async dispatch => {
  try {

    //dispatch start/end loading here...
    console.log('[REDUX_ACTION] getBRCByMonthPeriod-reqreqreq: ', req);

    const { data } = await api.fetchBRCByMonthPeriod(req);
    console.log('[REDUX_ACTION] getBRCByMonthPeriod-RESPPPPPP: ', data);
    dispatch({ type: FETCH_BILLRUN_CAN_BY_MP, payload: data});
  }
  catch (error) {
    console.log('[REDUX_ACTION] getBRCByMonthPeriod-err: ', error);

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
