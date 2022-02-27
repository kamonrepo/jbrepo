import { CREATE_BILLRUN, FETCH_BILLRUN } from '../constants/actionTypes';
import * as api from '../api/index';

export const createBillrun = req => async dispatch => {
    try {

        console.log('pasa-reqqqqq', JSON.stringify(req));

        const { data } = await api.createBillrun(req);
        dispatch({ type: CREATE_BILLRUN, payload: data});
        
    } catch (error) {
        console.log('redux-action-create-client-ERROR: ', error.message);
    }
};

export const getBillrun = () => async dispatch => {
    try {

      const { data } = await api.fetchBillrun();
      // console.log('redux-action-get-locations-server-respond: ', data)
      dispatch({ type: FETCH_BILLRUN, payload: data});

    } catch (error) {
      console.log(error);
    }
  };

