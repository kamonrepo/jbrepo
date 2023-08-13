import {  CREATE_PAYMENT, FETCH_PAYMENT_BY_ID, FETCH_PAYMENT } from '../constants/actionTypes';
import * as api from '../api/index';

export const createPayment = group => async dispatch => {
    try {

        const { data } = await api.createGroup(group);
        dispatch({ type: CREATE_PAYMENT, payload: data });
      
    } catch (error) {
        console.log('createGroup-error: ', error);
    }
}

export const getPayments = () => async dispatch => {
  try {

    const { data } = await api.fetchPayment();
    dispatch({ type: FETCH_PAYMENT, payload: data});

  } catch (error) {
    console.log(error);
  }
};
  

export const updatePayment = (req, type) => async (dispatch) => {
  try {

    const { data } = await api.updatePayment(req);

    dispatch({ type: CREATE_PAYMENT, payload: data});

  } catch (error) {
    console.log(error.message);
  }
};
