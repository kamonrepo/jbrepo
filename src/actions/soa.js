import { FETCH_SOA_BY_PMSGID, FETCH_SOAS, START_LOADING_SOAS, END_LOADING_SOAS } from '../constants/actionTypes';
import * as api from '../api/index';


export const getSoaByPMSGID = pmsgid => async dispatch => {
    try {

      dispatch({ type: START_LOADING_SOAS });
      const { data } = await api.fetchSoaByPMSGID(pmsgid);


      dispatch({ type: FETCH_SOA_BY_PMSGID, payload: data});
      dispatch({ type: END_LOADING_SOAS });

    } catch (error) {
      console.log(error);
    }
};

export const getSoas = () => async dispatch => {
  try {

    const { data } = await api.fetchSoas();
    dispatch({ type: FETCH_SOAS, payload: data});

  } catch (error) {
    console.log(error);
  }
};


  